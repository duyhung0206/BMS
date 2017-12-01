<?php

namespace App\Http\Controllers;

use App\Models\OrderAttribute;
use App\Models\OrderProduct;
use App\Models\PurchaseorderAttribute;
use App\Models\PurchaseorderProduct;
use App\Models\Supplier;
use App\Models\Order;
use App\Models\Purchaseorder;
use App\Models\Product;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Product::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:product',
            'sku' => 'required|unique:product',
        ]);
        if ($validator->fails()) {
            return response($validator->errors()->all(), 422);
        }

        $supplierId = $request->input('supplier_id');
        if($request->input('supplier_id') == 0){
            $supplier = Supplier::where('name', $request->input('supplier_name'))->first();
            if($supplier != null){
                return response($request->input('supplier_name').' exists !', 422);
            }else{
                if($request->input('create_new_supplier') == true){
                    $supplier = Supplier::create([
                        'name' => $request->input('supplier_name'),
                        'is_active' => 1
                    ]);
                    $supplierName = $supplier->name;
                    $supplierId = $supplier->id;
                }else{
                    $supplierName = $request->input('supplier_name');
                }

            }
        }else{
            $supplier = Supplier::find($supplierId);
            $supplierName = $supplier->name;
            $supplierId = $supplier->id;
        }

        $product = Product::create([
            'sku' => $request->input('sku'),
            'name' => $request->input('name'),
            'supplier_id' => $supplierId,
            'supplier_name' => $supplierName,
            'description' => $request->input('description'),
            'is_active' => $request->input('is_active')
        ]);
        return response($product, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::find($id);
        if(!$product){
            return response("Product has id $id don't exists !", 422);
        }

        /*get all info order*/
        $listOrder = array();
        OrderProduct::where('product_id', $id)->select('order_id')->get()->map(function($item) use(&$listOrder) {
            $listOrder[] = $item->order_id;
        });
        $orders = Order::find($listOrder);
        $totalBuy = 0;
        $totalReturn = 0;
        foreach ($orders as $key => $order){
            $orderItems = OrderProduct::where('order_id', $order->id)->get();
            $orders[$key]->items = $orderItems;
            foreach ($orderItems as $item){
                if($item->type != 1){
                    $totalBuy += $item->qty;
                }else{
                    $totalReturn += $item->qty;
                }
            }
            $orderFees = OrderAttribute::where('order_id', $order->id)->get();
            $orders[$key]->fees = $orderFees;
        }
        $product->orders = [
            'list' => $orders,
            'total' => $orders->count(),
            'totalBuy' => $totalBuy,
            'totalReturn' => $totalReturn,
        ];

        /*get all info purchaseorder*/
        $listPurchaseorder = array();
        PurchaseorderProduct::where('product_id', $id)->select('purchaseorder_id')->get()->map(function($item) use(&$listPurchaseorder) {
            $listPurchaseorder[] = $item->purchaseorder_id;
        });
        $purchaseorders = Purchaseorder::find($listPurchaseorder);
        $totalBuy = 0;
        $totalReturn = 0;
        foreach ($purchaseorders as $key => $purchaseorder){
            $purchaseorderItems = PurchaseorderProduct::where('purchaseorder_id', $purchaseorder->id)->get();
            $purchaseorders[$key]->items = $purchaseorderItems;
            foreach ($purchaseorderItems as $item){
                if($item->type != 1){
                    $totalBuy += $item->qty;
                }else{
                    $totalReturn += $item->qty;
                }
            }
            $purchaseorderFees = PurchaseorderAttribute::where('purchaseorder_id', $purchaseorder->id)->get();
            $purchaseorders[$key]->fees = $purchaseorderFees;
        }
        $product->purchaseorders = [
            'list' => $purchaseorders,
            'total' => $purchaseorders->count(),
            'totalBuy' => $totalBuy,
            'totalReturn' => $totalReturn,
        ];

        return $product;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $supplierId = $request->input('supplier_id');
        if($request->input('supplier_id') == 0){
            $supplier = Supplier::where('name', $request->input('supplier_name'))->first();
            if($supplier != null){
                return response($request->input('supplier_name').' exists !', 422);
            }else{
                if($request->input('create_new_supplier') == true){
                    $supplier = Supplier::create([
                        'name' => $request->input('supplier_name'),
                        'is_active' => 1
                    ]);
                    $supplierName = $supplier->name;
                    $supplierId = $supplier->id;
                }else{
                    $supplierName = $request->input('supplier_name');
                }

            }
        }else{
            $supplier = Supplier::find($supplierId);
            $supplierName = $supplier->name;
            $supplierId = $supplier->id;
        }
        $product = Product::find($id);
        if($product){
            $product->update([
                'sku' => $request->input('sku'),
                'name' => $request->input('name'),
                'supplier_id' => $supplierId,
                'supplier_name' => $supplierName,
                'description' => $request->input('description'),
                'is_active' => $request->input('is_active')
            ]);

            return response($this->show($product->id), 201);
        }else{
            return response('Product does not exist !', 422);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::find($id);
        if($product){
            /*Remove assign order item*/
            $orderItems = OrderProduct::where('product_id', $id);
            $orderItems->update([
                'product_id' => 0,
                'product_name' => 'Other'
            ]);

            /*Delete product*/
            $product->delete();
            return Product::all();
        }else{
            return response('Not found product', 422);
        }
    }
}

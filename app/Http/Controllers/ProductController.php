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
use App\Models\Season;
use App\Models\Setting;
use DateTime;
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
                return response($request->input('supplier_name').' đã tồn tại.', 422);
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
    public function show(Request $request, $id)
    {
        $select_period = $default_period = Setting::where('path', 'period_default')->first()->value;
        $report_start = $report_end = null;
        $startDate = null;
        $endDate = null;
        if($request->has('period')){
            $period = json_decode($request->input('period'));
            $select_period = $period->select_period;
            switch ($select_period){
                case 0:
                    break;
                case -1:
                    $startDate = isset($period->report_start) ? ($period->report_start == ""? null:$period->report_start): null;
                    $endDate = isset($period->report_end) ? ($period->report_end == ""? null:$period->report_end): null;

                    if($startDate != null){
                        $report_start = $startDate;
                        $startDate = DateTime::createFromFormat('d/m/Y', $startDate)->format('Y-m-d');
                    }
                    if($endDate != null){
                        $report_end = $endDate;
                        $endDate = DateTime::createFromFormat('d/m/Y', $endDate)->format('Y-m-d');
                    }

                    break;
                default:
                    $season = Season::find($select_period);
                    $startDate = $season->start;
                    $endDate = $season->end;
                    break;
            }
        }

        $product = Product::find($id);
        if(!$product){
            return response("Sản phẩm không tồn tại.", 422);
        }

        /*get all info order*/
        $listOrder = array();
        OrderProduct::where('product_id', $id)->select('order_id')->get()->map(function($item) use(&$listOrder) {
            $listOrder[] = $item->order_id;
        });
        $orders = Order::whereIn('id', $listOrder);
        if($startDate != null){
            $orders = $orders->where('order_date', '>=', date($startDate));
        }
        if($endDate != null){
            $orders = $orders->where('order_date', '<=', date($endDate));
        }
        $orders = $orders->get();
        $total_qty_ordered = 0;
        $total_amount_ordered = 0;
        $total_qty_refunded = 0;
        $total_amount_refunded = 0;
        $total_paid = 0;

        $customers = array();

        foreach ($orders as $key => $order){
            $orderItems = OrderProduct::where('order_id', $order->id)->get();
            $orders[$key]->items = $orderItems;
            $total_paid += $order->total_paid;

            if(!isset($customers[$order->customer_id])){
                $customers[$order->customer_id] = array(
                    "customer_id" => $order->customer_id,
                    "customer_name" => $order->customer_name,
                    "total_qty_ordered" => 0,
                    "total_amount_ordered" => 0,
                    "total_qty_refunded" => 0,
                    "total_amount_refunded" => 0,
                );
            }

            foreach ($orderItems as $item){
                if($item->type != 1){
                    $total_qty_ordered += $item->qty;
                    $total_amount_ordered += $item->row_total;

                    $customers[$order->customer_id]["total_qty_ordered"] += $item->qty;
                    $customers[$order->customer_id]["total_amount_ordered"] += $item->row_total;
                }else{
                    $total_qty_refunded += $item->qty;
                    $total_amount_refunded += $item->row_total;

                    $customers[$order->customer_id]["total_qty_refunded"] += $item->qty;
                    $customers[$order->customer_id]["total_amount_refunded"] += $item->row_total;
                }
            }
            $orderFees = OrderAttribute::where('order_id', $order->id)->get();
            $orders[$key]->fees = $orderFees;
        }
        $product->orders = [
            'list' => $orders,
            'count_order' => $orders->count(),
            'total_paid' => $total_paid,
            'total_qty_ordered' => $total_qty_ordered,
            'total_qty_refunded' => $total_qty_refunded,
            'total_amount_ordered' => $total_amount_ordered,
            'total_amount_refunded' => $total_amount_refunded,
        ];
        $product->customers = $customers;

        /*get all info purchaseorder*/
        $listPurchaseorder = array();
        PurchaseorderProduct::where('product_id', $id)->select('purchaseorder_id')->get()->map(function($item) use(&$listPurchaseorder) {
            $listPurchaseorder[] = $item->purchaseorder_id;
        });
        $purchaseorders = Purchaseorder::find($listPurchaseorder);

        $total_qty_ordered = 0;
        $total_amount_ordered = 0;
        $total_qty_refunded = 0;
        $total_amount_refunded = 0;
        $total_paid = 0;

        $suppliers = array();

        foreach ($purchaseorders as $key => $purchaseorder){
            $purchaseorderItems = PurchaseorderProduct::where('purchaseorder_id', $purchaseorder->id)->get();
            $purchaseorders[$key]->items = $purchaseorderItems;
            $total_paid += $purchaseorder->total_paid;

            if(!isset($suppliers[$purchaseorder->supplier_id])){
                $suppliers[$purchaseorder->supplier_id] = array(
                    "supplier_id" => $order->supplier_id,
                    "supplier_name" => $order->supplier_name,
                    "total_qty_ordered" => 0,
                    "total_amount_ordered" => 0,
                    "total_qty_refunded" => 0,
                    "total_amount_refunded" => 0,
                );
            }

            foreach ($purchaseorderItems as $item){
                if($item->type != 1){
                    $total_qty_ordered += $item->qty;
                    $total_amount_ordered += $item->row_total;

                    $suppliers[$purchaseorder->supplier_id]["total_qty_ordered"] += $item->qty;
                    $suppliers[$purchaseorder->supplier_id]["total_amount_ordered"] += $item->row_total;
                }else{
                    $total_qty_refunded += $item->qty;
                    $total_amount_refunded += $item->row_total;

                    $suppliers[$purchaseorder->supplier_id]["total_qty_refunded"] += $item->qty;
                    $suppliers[$purchaseorder->supplier_id]["total_amount_refunded"] += $item->row_total;
                }
            }
            $purchaseorderFees = PurchaseorderAttribute::where('purchaseorder_id', $purchaseorder->id)->get();
            $purchaseorders[$key]->fees = $purchaseorderFees;
        }
        $product->purchaseorders = [
            'list' => $purchaseorders,
            'count_order' => $purchaseorders->count(),
            'total_paid' => $total_paid,
            'total_qty_ordered' => $total_qty_ordered,
            'total_qty_refunded' => $total_qty_refunded,
            'total_amount_ordered' => $total_amount_ordered,
            'total_amount_refunded' => $total_amount_refunded,
        ];

        $product->suppliers = $suppliers;

        $product->select_period = $select_period;
        $product->report_start = $report_start;
        $product->report_end = $report_end;

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
        $checkSkuError = Product::where('id', '<>', $id)->where('sku', $request->input('sku'))->count();
        $checkNameError = Product::where('id', '<>', $id)->where('name', $request->input('name'))->count();

        if($checkSkuError > 0){
            return response('The sku has already been taken.', 422);
        }

        if($checkNameError > 0){
            return response('The name has already been taken.', 422);
        }

        if($request->input('supplier_id') == 0){
            $supplier = Supplier::where('name', $request->input('supplier_name'))->first();
            if($supplier != null){
                return response($request->input('supplier_name').' đã tồn tại.', 422);
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

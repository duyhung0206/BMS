<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Purchaseorder;
use App\Models\PurchaseorderProduct;
use App\Models\PurchaseorderAttribute;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use DateTime;
use Mockery\Exception;

class PurchaseorderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Purchaseorder::all();
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

        $supplierName = $request->input('supplier_name');
        $supplierId = $request->input('supplier_id');
        $supplierEmail = '';
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
            $supplierEmail = $supplier->email;
        }
        $order_date =  DateTime::createFromFormat('d/m/Y', $request->input('order_date'))->format('Y-m-d');
        $supplierName = $supplierName == ''? 'Other': $supplierName;
        
        $purchaseorder = Purchaseorder::create([
            'order_date' => $order_date,
            'supplier_id' => $supplierId,
            'supplier_name' => $supplierName,
            'supplier_email' => $supplierEmail,
            'total_item_count' => $request->input('total_item_count'),
            'total_qty_ordered' => $request->input('total_qty_ordered'),
            'total_paid' => $request->input('total_paid'),
            'subtotal' => $request->input('subtotal'),
            'grand_total' => $request->input('grand_total'),
            'note' => $request->input('note'),
        ]);

        $incrementId = str_pad($purchaseorder->id, 7, "0", STR_PAD_LEFT);
        $purchaseorder->increment_id = $incrementId;
        $purchaseorder->save();
        try{
            $purchaseorderItems = $request->input('items');
            foreach ($purchaseorderItems as $item){
                if($item['product_id'] != 0){
                    $product = Product::find($item['product_id']);
                    $productId = $product->id;
                    $productSku = $product->sku;
                    $productName = $product->name;
                }else{
                    $productId = 0;
                    $productSku = '';
                    $productName = 'Other';
                }
                PurchaseorderProduct::create([
                    'purchaseorder_id' => $purchaseorder->id,
                    'product_id' => $productId,
                    'sku' => $productSku,
                    'product_name' => $productName,
                    'price' => $item['price'],
                    'qty' => $item['qty'],
                    'row_total' => $item['row_total'],
                    'type' => $item['type'],
                ]);
            }

            $fees = $request->input('fees');
            foreach ($fees as $fee){
                PurchaseorderAttribute::create([
                    'purchaseorder_id' => $purchaseorder->id,
                    'title' => $fee['title'],
                    'value' => $fee['value'],
                    'type' => true,
                ]);
            }
        } catch (Exception $e) {
            $purchaseorder->delete();
        }

        return response($this->show($purchaseorder->id), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $purchaseorder = Purchaseorder::find($id);

        if(!$purchaseorder){
            return response("Purchaseorder has id $id don't exists !", 422);
        }

        $purchaseorderItems = PurchaseorderProduct::where('purchaseorder_id', $purchaseorder->id)->get();
        $purchaseorder->items = $purchaseorderItems;
        $purchaseorderFees = PurchaseorderAttribute::where('purchaseorder_id', $purchaseorder->id)->get();
        $purchaseorder->fees = $purchaseorderFees;
        return $purchaseorder;
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
        $supplierEmail = '';
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
            $supplierEmail = $supplier->email;
        }
        $order_date =  DateTime::createFromFormat('d/m/Y', $request->input('order_date'))->format('Y-m-d');
        $supplierName = $supplierName == ''? 'Other': $supplierName;
        $purchaseorder = Purchaseorder::find($id);
        if($purchaseorder->id){
            $purchaseorder->update([
                'order_date' => $order_date,
                'supplier_id' => $supplierId,
                'supplier_name' => $supplierName,
                'supplier_email' => $supplierEmail,
                'total_item_count' => $request->input('total_item_count'),
                'total_qty_ordered' => $request->input('total_qty_ordered'),
                'total_paid' => $request->input('total_paid'),
                'subtotal' => $request->input('subtotal'),
                'grand_total' => $request->input('grand_total'),
                'note' => $request->input('note'),
            ]);

            try{
                $purchaseorderItems = $request->input('items');
                PurchaseorderProduct::where('purchaseorder_id', $purchaseorder->id)->delete();
                foreach ($purchaseorderItems as $item){
                    if($item['product_id'] != 0){
                        $product = Product::find($item['product_id']);
                        $productId = $product->id;
                        $productSku = $product->sku;
                        $productName = $product->name;
                    }else{
                        $productId = 0;
                        $productSku = '';
                        $productName = 'Other';
                    }
                    PurchaseorderProduct::create([
                        'purchaseorder_id' => $purchaseorder->id,
                        'product_id' => $productId,
                        'sku' => $productSku,
                        'product_name' => $productName,
                        'price' => $item['price'],
                        'qty' => $item['qty'],
                        'row_total' => $item['row_total'],
                        'type' => $item['type'],
                    ]);
                }

                $fees = $request->input('fees');
                PurchaseorderAttribute::where('purchaseorder_id', $purchaseorder->id)->delete();
                foreach ($fees as $fee){
                    PurchaseorderAttribute::create([
                        'purchaseorder_id' => $purchaseorder->id,
                        'title' => $fee['title'],
                        'value' => $fee['value'],
                        'type' => true,
                    ]);
                }
            } catch (Exception $e) {
                $purchaseorder->delete();
            }

            return response($this->show($purchaseorder->id), 201);
        }else{
            return response('Purchaseorder does not exist !', 422);
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
        $purchaseorderId = $id;
        try{
            /*Delete fees*/
            PurchaseorderAttribute::where('purchaseorder_id', $purchaseorderId)->delete();
            /*Delete purchaseorder items*/
            PurchaseorderProduct::where('purchaseorder_id', $purchaseorderId)->delete();
            /*Delete purchaseorder*/
            Purchaseorder::destroy($purchaseorderId);
            return response('Purchaseorder delete success !', 201);
        }catch (Exception $e){
            return response($e->getMessage(), 422);
        }
    }
}

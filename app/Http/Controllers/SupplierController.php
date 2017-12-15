<?php

namespace App\Http\Controllers;

use App\Models\Purchaseorder;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\PurchaseorderAttribute;
use App\Models\PurchaseorderProduct;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Supplier::all();
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
            'name' => 'required|unique:supplier',
            'email' => 'email'
        ]);
        if ($validator->fails()) {
            return response($validator->errors()->all(), 422);
        }

        $supplier = Supplier::create([
            'avatar' => '',
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'address' => $request->input('address'),
            'is_active' => $request->input('is_active')
        ]);
        return response($supplier, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        /*get info customer*/
        $supplier = Supplier::find($id);

        $purchaseorders = Purchaseorder::where('supplier_id', $id)->get();
        $total_qty_ordered = 0;
        $total_qty_refunded = 0;
        foreach ($purchaseorders as $key => $purchaseorder){
            $purchaseorderItems = PurchaseorderProduct::where('purchaseorder_id', $purchaseorder->id)->get();
            $purchaseorders[$key]->items = $purchaseorderItems;
            foreach ($purchaseorderItems as $item){
                if($item->type != 1){
                    $total_qty_ordered += $item->qty;
                }else{
                    $total_qty_refunded += $item->qty;
                }
            }
            $purchaseorderFees = PurchaseorderAttribute::where('purchaseorder_id', $purchaseorder->id)->get();
            $purchaseorders[$key]->fees = $purchaseorderFees;
        }
        $supplier->orders = [
            'list' => $purchaseorders,
            'total' => $purchaseorders->count(),
            'total_qty_ordered' => $total_qty_ordered,
            'total_qty_refunded' => $total_qty_refunded,
        ];

        return $supplier;
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
        $checkNameError = Supplier::where('id', '<>', $id)->where('name', $request->input('name'))->count();

        if($checkNameError > 0){
            return response('The name has already been taken.', 422);
        }

        $supplier = Supplier::find($id);
        if($supplier->id){
            $oldName = $supplier->name;
            $supplier->update([
                'avatar' => '',
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'address' => $request->input('address'),
                'phone' => $request->input('phone'),
                'note' => $request->input('note'),
                'is_active' => $request->input('is_active')
            ]);

            if($oldName != $supplier->name){
                Purchaseorder::where('supplier_id', $supplier->id)->update([
                   'supplier_name' => $supplier->name
                ]);

                Product::where('supplier_id', $supplier->id)->update([
                    'supplier_name' => $supplier->name
                ]);
            }
            return response($this->show($supplier->id), 201);
        }else{
            return response('Supplier does not exist !', 422);
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
        $supplier = Supplier::find($id);
        if($supplier){
            /*delete all purchaseorder*/
            $purchaseorders = Purchaseorder::where('supplier_id', $supplier->id)->get();
            foreach ($purchaseorders as $purchaseorder){
                /*Delete fees*/
                PurchaseorderAttribute::where('purchaseorder_id', $purchaseorder->id)->delete();
                /*Delete purchaseorder items*/
                PurchaseorderProduct::where('purchaseorder_id', $purchaseorder->id)->delete();
                /*Delete purchaseorder*/
                Purchaseorder::destroy($purchaseorder->id);
            }

            /*Remove assign product*/
            $product = Product::where('supplier_id', $supplier->id);
            $product->update([
                'supplier_id' => 0
            ]);

            /*Delete supplier*/
            $supplier->delete();
            return Supplier::all();
        }else{
            return response('Not found supplier', 422);
        }
    }
}

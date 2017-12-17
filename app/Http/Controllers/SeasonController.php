<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Season;
use App\Models\OrderAttribute;
use App\Models\OrderProduct;
use App\Models\PurchaseorderAttribute;
use App\Models\PurchaseorderProduct;
use App\Models\Order;
use App\Models\Purchaseorder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use DateTime;
class SeasonController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Season::all();
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
            'name' => 'required|unique:season',
            'start' => 'required',
            'end' => 'required',
        ]);
        if ($validator->fails()) {
            return response($validator->errors()->all(), 422);
        }

        $startDate =  DateTime::createFromFormat('d/m/Y', $request->input('start'))->format('Y-m-d');
        $endDate =  DateTime::createFromFormat('d/m/Y', $request->input('end'))->format('Y-m-d');

        $season = Season::create([
            'name' => $request->input('name'),
            'start' => $startDate,
            'end' => $endDate,
            'description' => $request->input('description'),
            'is_active' => $request->input('is_active'),
        ]);
        return response($season, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $season = Season::find($id);
        if(!$season){
            return response("Season has id $id don't exists !", 422);
        }

        $startDate = $season->start;
        $endDate = $season->end;

        /*get all info order*/
        $orders = Order::where('order_date', '>=', $startDate)->where('order_date', '<=', $endDate)->get();
        $total_qty_ordered = 0;
        $total_qty_refunded = 0;
        $total_amount_ordered = 0;
        $total_amount_refunded = 0;
        $total_paid = 0;
        $grand_total = 0;

        $products = array();
        $customers = array();

        foreach ($orders as $key => $order){
            $orderItems = OrderProduct::where('order_id', $order->id)->get();
            $orders[$key]->items = $orderItems;
            $total_paid += $order->total_paid;
            $grand_total += $order->grand_total;

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

                if(!isset($products[$item->product_id])){
                    $products[$item->product_id] = array(
                        "product_id" => $item->product_id,
                        "product_name" => $item->product_name,
                        "sku" => $item->sku,
                        "total_qty_ordered_o" => 0,
                        "total_amount_ordered_o" => 0,
                        "total_qty_refunded_o" => 0,
                        "total_amount_refunded_o" => 0,
                        "total_qty_ordered_po" => 0,
                        "total_amount_ordered_po" => 0,
                        "total_qty_refunded_po" => 0,
                        "total_amount_refunded_po" => 0,
                    );
                }
                if($item->type != 1){
                    $total_qty_ordered += $item->qty;
                    $total_amount_ordered += $item->row_total;

                    $products[$item->product_id]["total_qty_ordered_o"] += $item->qty;
                    $products[$item->product_id]["total_amount_ordered_o"] += $item->row_total;

                    $customers[$order->customer_id]["total_qty_ordered"] += $item->qty;
                    $customers[$order->customer_id]["total_amount_ordered"] += $item->row_total;
                }else{
                    $total_qty_refunded += $item->qty;
                    $total_amount_refunded += $item->row_total;

                    $products[$item->product_id]["total_qty_refunded_o"] += $item->qty;
                    $products[$item->product_id]["total_amount_refunded_o"] += $item->row_total;

                    $customers[$order->customer_id]["total_qty_refunded"] += $item->qty;
                    $customers[$order->customer_id]["total_amount_refunded"] += $item->row_total;
                }
            }
            $orderFees = OrderAttribute::where('order_id', $order->id)->get();
            $orders[$key]->fees = $orderFees;
        }

        $season->customers = $customers;
        $season->orders = [
            'list' => $orders,
            'total_paid' => $total_paid,
            'grand_total' => $grand_total,
            'count_order' => $orders->count(),
            'total_qty_ordered' => $total_qty_ordered,
            'total_qty_refunded' => $total_qty_refunded,
            'total_amount_ordered' => $total_amount_ordered,
            'total_amount_refunded' => $total_amount_refunded,
        ];

        /*get all info purchaseorder*/
        $purchaseorders = Purchaseorder::where('order_date', '>=', $startDate)->where('order_date', '<=', $endDate)->get();

        $total_qty_ordered = 0;
        $total_qty_refunded = 0;
        $total_amount_ordered = 0;
        $total_amount_refunded = 0;
        $total_paid = 0;
        $grand_total = 0;

        $supplier = array();

        foreach ($purchaseorders as $key => $purchaseorder){
            $purchaseorderItems = PurchaseorderProduct::where('purchaseorder_id', $purchaseorder->id)->get();
            $purchaseorders[$key]->items = $purchaseorderItems;
            $total_paid += $purchaseorder->total_paid;
            $grand_total += $purchaseorder->grand_total;

            if(!isset($suppliers[$purchaseorder->supplier_id])){
                $suppliers[$purchaseorder->supplier_id] = array(
                    "supplier_id" => $purchaseorder->supplier_id,
                    "supplier_name" => $purchaseorder->supplier_name,
                    "total_qty_ordered" => 0,
                    "total_amount_ordered" => 0,
                    "total_qty_refunded" => 0,
                    "total_amount_refunded" => 0,
                );
            }

            foreach ($purchaseorderItems as $item){
                if(!isset($products[$item->product_id])){
                    $products[$item->product_id] = array(
                        "product_id" => $item->product_id,
                        "product_name" => $item->product_name,
                        "sku" => $item->sku,
                        "total_qty_ordered_o" => 0,
                        "total_amount_ordered_o" => 0,
                        "total_qty_refunded_o" => 0,
                        "total_amount_refunded_o" => 0,
                        "total_qty_ordered_po" => 0,
                        "total_amount_ordered_po" => 0,
                        "total_qty_refunded_po" => 0,
                        "total_amount_refunded_po" => 0,
                    );
                }
                if($item->type != 1){
                    $total_qty_ordered += $item->qty;
                    $total_amount_ordered += $item->row_total;

                    $products[$item->product_id]["total_qty_ordered_po"] += $item->qty;
                    $products[$item->product_id]["total_amount_ordered_po"] += $item->row_total;

                    $suppliers[$purchaseorder->supplier_id]["total_qty_ordered"] += $item->qty;
                    $suppliers[$purchaseorder->supplier_id]["total_amount_ordered"] += $item->row_total;
                }else{
                    $total_qty_refunded += $item->qty;
                    $total_amount_refunded += $item->row_total;

                    $products[$item->product_id]["total_qty_refunded_po"] += $item->qty;
                    $products[$item->product_id]["total_amount_refunded_po"] += $item->row_total;

                    $suppliers[$purchaseorder->supplier_id]["total_qty_refunded"] += $item->qty;
                    $suppliers[$purchaseorder->supplier_id]["total_amount_refunded"] += $item->row_total;
                }
            }
            $purchaseorderFees = PurchaseorderAttribute::where('purchaseorder_id', $purchaseorder->id)->get();
            $purchaseorders[$key]->fees = $purchaseorderFees;
        }
        $season->products = $products;
        $season->suppliers = $suppliers;
        $season->purchaseorders = [
            'list' => $purchaseorders,
            'total_paid' => $total_paid,
            'grand_total' => $grand_total,
            'count_order' => $purchaseorders->count(),
            'total_qty_ordered' => $total_qty_ordered,
            'total_qty_refunded' => $total_qty_refunded,
            'total_amount_ordered' => $total_amount_ordered,
            'total_amount_refunded' => $total_amount_refunded,
        ];

        return $season;
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
        $checkNameError = Season::where('id', '<>', $id)->where('name', $request->input('name'))->count();

        if($checkNameError > 0){
            return response('The name has already been taken.', 422);
        }

        $season = Season::find($id);
        if($season){
            $startDate =  DateTime::createFromFormat('d/m/Y', $request->input('start'))->format('Y-m-d');
            $endDate =  DateTime::createFromFormat('d/m/Y', $request->input('end'))->format('Y-m-d');

            $season->update([
                'name' => $request->input('name'),
                'start' => $startDate,
                'end' => $endDate,
                'description' => $request->input('description'),
                'is_active' => $request->input('is_active'),
            ]);

            return response($this->show($season->id), 201);
        }else{
            return response('Season does not exist !', 422);
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
        $season = Season::find($id);
        if($season){
            $season->delete();
            return Season::all();
        }else{
            return response('Not found season', 422);
        }
    }
}

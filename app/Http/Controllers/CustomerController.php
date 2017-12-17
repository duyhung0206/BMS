<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Setting;
use App\Models\Season;

use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\OrderAttribute;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Customer::all();
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
            'name' => 'required|unique:customer',
            'email' => 'email'
        ]);
        if ($validator->fails()) {
            return response($validator->errors()->all(), 422);
        }

        $customer = Customer::create([
            'avatar' => '',
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'address' => $request->input('address'),
            'phone' => $request->input('phone'),
            'note' => $request->input('note'),
            'is_active' => $request->input('is_active')
        ]);
        return response($customer, 201);
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
        }else{
            $season = Season::find($select_period);
            $startDate = $season->start;
            $endDate = $season->end;
        }

        /*get info customer*/
        $customer = Customer::find($id);

        $orders = Order::where('customer_id', $id);
        if($startDate != null){
            $orders = $orders->where('order_date', '>=', date($startDate));
        }
        if($endDate != null){
            $orders = $orders->where('order_date', '<=', date($endDate));
        }
        $orders = $orders->get();

        $total_qty_ordered = 0;
        $total_qty_refunded = 0;
        $total_amount_ordered = 0;
        $total_amount_refunded = 0;
        $total_paid = 0;
        $grand_total = 0;

        $products = array();
        foreach ($orders as $key => $order){
            $orderItems = OrderProduct::where('order_id', $order->id)->get();
            $orders[$key]->items = $orderItems;
            $total_paid += $order->total_paid;
            $grand_total += $order->grand_total;
            foreach ($orderItems as $item){
                if(!isset($products[$item->product_id])){
                    $products[$item->product_id] = array(
                        "product_id" => $item->product_id,
                        "product_name" => $item->product_name,
                        "sku" => $item->sku,
                        "total_qty_ordered" => 0,
                        "total_amount_ordered" => 0,
                        "total_qty_refunded" => 0,
                        "total_amount_refunded" => 0,
                    );
                }
                if($item->type != 1){
                    $total_qty_ordered += $item->qty;
                    $total_amount_ordered += $item->row_total;

                    $products[$item->product_id]["total_qty_ordered"] += $item->qty;
                    $products[$item->product_id]["total_amount_ordered"] += $item->row_total;
                }else{
                    $total_qty_refunded += $item->qty;
                    $total_amount_refunded += $item->row_total;

                    $products[$item->product_id]["total_qty_refunded"] += $item->qty;
                    $products[$item->product_id]["total_amount_refunded"] += $item->row_total;
                }
            }
            $orderFees = OrderAttribute::where('order_id', $order->id)->get();
            $orders[$key]->fees = $orderFees;
        }
        $customer->products = $products;
        $customer->orders = [
            'list' => $orders,
            'total_paid' => $total_paid,
            'grand_total' => $grand_total,
            'count_order' => $orders->count(),
            'total_qty_ordered' => $total_qty_ordered,
            'total_qty_refunded' => $total_qty_refunded,
            'total_amount_ordered' => $total_amount_ordered,
            'total_amount_refunded' => $total_amount_refunded,
        ];

        $customer->select_period = $select_period;
        $customer->report_start = $report_start;
        $customer->report_end = $report_end;

        return $customer;
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
        $checkNameError = Customer::where('id', '<>', $id)->where('name', $request->input('name'))->count();

        if($checkNameError > 0){
            return response('The name has already been taken.', 422);
        }

        $customer = Customer::find($id);
        if($customer->id){
            $oldName = $customer->name;
            $customer->update([
                'avatar' => '',
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'address' => $request->input('address'),
                'phone' => $request->input('phone'),
                'note' => $request->input('note'),
                'is_active' => $request->input('is_active')
            ]);

            if($oldName != $customer->name){
                Order::where('customer_id', $customer->id)->update([
                    'customer_name' => $customer->name
                ]);
            }
            return response($this->show($request, $customer->id), 201);
        }else{
            return response('Customer does not exist !', 422);
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
        $customer = Customer::find($id);
        if($customer){
            /*Remove assign all order*/
            $orders = Order::where('customer_id', $customer->id);
            $orders->update([
               'customer_id' => 0
            ]);

            /*Delete customer*/
            $customer->delete();
            return Customer::all();
        }else{
            return response('Not found customer', 422);
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Customer;

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
    public function show($id)
    {
        /*get info customer*/
        $customer = Customer::find($id);

        $orders = Order::where('customer_id', $id)->get();
        $total_qty_ordered = 0;
        $total_qty_refunded = 0;
        foreach ($orders as $key => $order){
            $orderItems = OrderProduct::where('order_id', $order->id)->get();
            $orders[$key]->items = $orderItems;
            foreach ($orderItems as $item){
                if($item->type != 1){
                    $total_qty_ordered += $item->qty;
                }else{
                    $total_qty_refunded += $item->qty;
                }
            }
            $orderFees = OrderAttribute::where('order_id', $order->id)->get();
            $orders[$key]->fees = $orderFees;
        }
        $customer->orders = [
            'list' => $orders,
            'total' => $orders->count(),
            'total_qty_ordered' => $total_qty_ordered,
            'total_qty_refunded' => $total_qty_refunded,
        ];

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
            return response($this->show($customer->id), 201);
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

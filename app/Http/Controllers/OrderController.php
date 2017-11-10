<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\OrderAttribute;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use DateTime;
use Mockery\Exception;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Order::all();
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
//        echo str_pad('15', 7, "0", STR_PAD_LEFT);

        $customerName = $request->input('customer_name');
        $customerId = $request->input('customer_id');
        $customerEmail = '';
        if($request->input('customer_id') == 0){
            $customer = Customer::where('name', $request->input('customer_name'))->first();
            if($customer != null){
                return response($request->input('customer_name').' exists !', 422);
            }else{
                if($request->input('create_new_customer') == true){
                    $customer = Customer::create([
                        'name' => $request->input('customer_name'),
                        'is_active' => 1
                    ]);
                    $customerName = $customer->name;
                    $customerId = $customer->id;
                }else{
                    $customerName = $request->input('customer_name');
                }

            }
        }else{
            $customer = Customer::find($customerId);
            $customerName = $customer->name;
            $customerEmail = $customer->email;
        }
        $order_date =  DateTime::createFromFormat('d/m/Y', $request->input('order_date'))->format('Y-m-d');

        $order = Order::create([
            'order_date' => $order_date,
            'customer_id' => $customerId,
            'customer_name' => $customerName,
            'customer_email' => $customerEmail,
            'total_item_count' => $request->input('total_item_count'),
            'total_qty_orderd' => $request->input('total_qty_orderd'),
            'total_paid' => $request->input('total_paid'),
            'total_due' => $request->input('total_due'),
            'note' => $request->input('note'),
        ]);

        $incrementId = str_pad($order->id, 10, "0", STR_PAD_LEFT);
        $order->increment_id = $incrementId;
        $order->save();
        try{
            $orderItems = $request->input('items');
            foreach ($orderItems as $item){
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
                OrderProduct::create([
                    'order_id' => $order->id,
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
                OrderAttribute::create([
                    'order_id' => $order->id,
                    'title' => $fee['title'],
                    'value' => $fee['value'],
                    'type' => true,
                ]);
            }
        } catch (Exception $e) {
            $order->delete();
        }

        return response($this->show($order->id), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $order = Order::find($id);
        $orderItems = OrderProduct::where('order_id', $order->id)->get();
        $order->items = $orderItems;
        $orderFees = OrderAttribute::where('order_id', $order->id)->get();
        $order->fees = $orderFees;
        return $order;
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}

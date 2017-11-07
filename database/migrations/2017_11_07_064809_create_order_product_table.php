<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderProductTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*order_id, product_id, sku, product_name, price, qty*/
        Schema::create('order_product', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('order_id')->unsigned();
            $table->integer('product_id');
            $table->string('sku');
            $table->string('product_name');
            $table->boolean('type')->comment('buy/refund');
            $table->decimal('price', 11, 2);
            $table->decimal('qty', 11, 2);
            $table->decimal('row_total', 11, 2);
            $table->foreign('order_id')
                ->references('id')->on('order')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('order_product');
    }
}

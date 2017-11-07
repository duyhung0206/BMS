<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchaseorderProductTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchaseorder_product', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('purchaseorder_id')->unsigned();
            $table->integer('product_id');
            $table->string('sku');
            $table->string('product_name');
            $table->boolean('type')->comment('buy/refund');
            $table->decimal('price', 11, 2);
            $table->decimal('qty', 11, 2);
            $table->decimal('row_total', 11, 2);
            $table->foreign('purchaseorder_id')
                ->references('id')->on('purchaseorder')
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
        Schema::drop('purchaseorder_product');
    }
}

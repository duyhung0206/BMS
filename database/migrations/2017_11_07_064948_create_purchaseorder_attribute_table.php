<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchaseorderAttributeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchaseorder_attribute', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('purchaseorder_id')->unsigned();
            $table->string('title');
            $table->string('value');
            $table->integer('type');
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
        Schema::drop('purchaseorder_attribute');
    }
}

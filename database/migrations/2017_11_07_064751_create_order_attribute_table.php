<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderAttributeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
            Schema::create('order_attribute', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('order_id')->unsigned();
                $table->string('title');
                $table->decimal('value', 11, 2);;
                $table->integer('type');
                $table->foreign('order_id')->references('id')->on('order')->onDelete('cascade');
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
        Schema::drop('order_attribute');
    }
}

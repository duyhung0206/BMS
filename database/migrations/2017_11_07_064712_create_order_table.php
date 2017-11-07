<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('increment_id');
            $table->integer('product_id');
            $table->date('order_date');
            $table->integer('customer_id');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->decimal('total_item_count', 11, 2);
            $table->decimal('total_qty_ordered', 11, 2);
            $table->decimal('total_due', 11, 2);
            $table->decimal('total_paid', 11, 2);
            $table->longText('note');
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
        Schema::drop('order');
    }
}

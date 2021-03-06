<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'order';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['increment_id', 'order_date', 'customer_id', 'customer_name', 'customer_email', 'total_item_count', 'total_qty_ordered', 'total_paid', 'subtotal','grand_total', 'note'];
}

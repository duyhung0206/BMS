<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchaseorder extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'purchaseorder';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['increment_id', 'order_date', 'supplier_id', 'supplier_name', 'supplier_email', 'total_item_count', 'total_qty_ordered', 'total_paid', 'subtotal','grand_total', 'note'];
}

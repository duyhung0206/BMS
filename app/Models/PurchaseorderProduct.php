<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseorderProduct extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'purchaseorder_product';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['purchaseorder_id', 'product_id', 'sku', 'product_name','type', 'price', 'qty', 'row_total'];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseorderAttribute extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'purchaseorder_attribute';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['purchaseorder_id', 'title', 'value', 'type'];
}

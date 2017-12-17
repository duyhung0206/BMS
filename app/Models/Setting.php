<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'setting';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['path', 'value'];
}

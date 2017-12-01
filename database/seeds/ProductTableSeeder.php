<?php

use Illuminate\Database\Seeder;
use App\Models\Product;
class ProductTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //'sku', 'name', 'description', 'supplier_name', 'supplier_id', 'is_active'
        Product::create([
        	'sku' => 'kdtb',
        	'name' => 'Kháng dân Thái Bình',
        	'description' =>'',
        	'supplier_name' =>'Công ty giống Thái Bình',
        	'supplier_id' =>1,
        	'is_active' => 1,
        ]);
        Product::create([
            'sku' => 'skdtb',
            'name' => 'Siêu kháng dân Thái Bình',
            'description' =>'',
            'supplier_name' =>'Công ty giống Thái Bình',
            'supplier_id' =>1,
            'is_active' => 1,
        ]);
        Product::create([
            'sku' => 'bc15',
            'name' => 'BC15',
            'description' =>'',
            'supplier_name' =>'Công ty giống Thái Bình',
            'supplier_id' =>1,
            'is_active' => 1,
        ]);

        Product::create([
            'sku' => 'skdtw',
            'name' => 'Siêu kháng dân Trung ương',
            'description' =>'',
            'supplier_name' =>'Công ty giống Trung ương',
            'supplier_id' =>2,
            'is_active' => 1,
        ]);

        Product::create([
            'sku' => 'q5tw',
            'name' => 'Q5 Trung ương',
            'description' =>'',
            'supplier_name' =>'Công ty giống Trung ương',
            'supplier_id' =>2,
            'is_active' => 1,
        ]);

        Product::create([
            'sku' => 'kdtw',
            'name' => 'Kháng dân Trung ương',
            'description' =>'',
            'supplier_name' =>'Công ty giống Trung ương',
            'supplier_id' =>2,
            'is_active' => 1,
        ]);

    }
}

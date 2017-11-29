<?php

use Illuminate\Database\Seeder;
use App\Models\Supplier;
class SupplierTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Supplier::create([
        	'name' => 'Công ty giống Thái Bình',
        	'email' => 'tb@gmail.vn',
        	'address' =>'',
        	'phone' =>'',
        	'note' =>'',
        	'is_active' => 1,
        ]);
        Supplier::create([
            'name' => 'Công ty giống Trung ương',
            'email' => 'tw@gmail.vn',
            'address' =>'',
            'phone' =>'',
            'note' =>'',
            'is_active' => 1,
        ]);
    }
}

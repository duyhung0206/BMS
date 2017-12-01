<?php

use Illuminate\Database\Seeder;
use App\Models\Customer;
class CustomerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Customer::create([
        	'name' => 'Nguyễn Văn A',
        	'email' => 'nguyen_van_a@gmail.vn',
        	'address' =>'Thắng',
        	'phone' =>'',
        	'note' =>'',
        	'is_active' => 1,
        ]);
        Customer::create([
            'name' => 'Nguyễn Văn B',
            'email' => 'nguyen_van_b@gmail.vn',
            'address' =>'Phú Bình',
            'phone' =>'',
            'note' =>'',
            'is_active' => 1,
        ]);
    }
}

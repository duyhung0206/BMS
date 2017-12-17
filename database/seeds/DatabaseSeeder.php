<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        $this->call(SettingTableSeeder::class);
        $this->call(UserTableSeeder::class);
        $this->call(SupplierTableSeeder::class);
        $this->call(CustomerTableSeeder::class);
        $this->call(ProductTableSeeder::class);

        Model::reguard();
    }
}

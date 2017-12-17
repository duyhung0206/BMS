<?php

use Illuminate\Database\Seeder;
use App\Models\Setting;
class SettingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Setting::create([
        	'path' => 'period_default',
        	'value' => 0
        ]);
        Setting::create([
            'path' => 'theme_default',
            'value' => 'paper'
        ]);
    }
}

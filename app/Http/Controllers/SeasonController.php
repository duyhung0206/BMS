<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Season;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use DateTime;
class SeasonController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Season::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:season',
            'start' => 'required',
            'end' => 'required',
        ]);
        if ($validator->fails()) {
            return response($validator->errors()->all(), 422);
        }

        $startDate =  DateTime::createFromFormat('d/m/Y', $request->input('start'))->format('Y-m-d');
        $endDate =  DateTime::createFromFormat('d/m/Y', $request->input('end'))->format('Y-m-d');

        $season = Season::create([
            'name' => $request->input('name'),
            'start' => $startDate,
            'end' => $endDate,
            'description' => $request->input('description'),
            'is_active' => $request->input('is_active'),
        ]);
        return response($season, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $season = Season::find($id);
        if($season){
            $season->delete();
            return Season::all();
        }else{
            return response('Not found season', 422);
        }
    }
}

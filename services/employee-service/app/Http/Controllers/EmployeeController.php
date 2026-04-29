<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Http\Requests\EmployeeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['department', 'position', 'contact']);

        // Filtering
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Paging
        $perPage = $request->input('per_page', 10);
        $employees = $query->paginate($perPage);

        return response()->json($employees, 200);
    }

    public function store(EmployeeRequest $request)
    {
        DB::beginTransaction();
        try {
            $employee = Employee::create($request->only([
                'name', 'email', 'department_id', 'position_id', 'join_date', 'status'
            ]));

            $employee->contact()->create($request->only([
                'phone_number', 'address', 'emergency_contact_name', 'emergency_contact_phone'
            ]));

            DB::commit();
            return response()->json($employee->load(['department', 'position', 'contact']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create employee', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $employee = Employee::with(['department', 'position', 'contact'])->find($id);
        
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        return response()->json($employee, 200);
    }

    public function update(EmployeeRequest $request, $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        DB::beginTransaction();
        try {
            $employee->update($request->only([
                'name', 'email', 'department_id', 'position_id', 'join_date', 'status'
            ]));

            if ($employee->contact) {
                $employee->contact->update($request->only([
                    'phone_number', 'address', 'emergency_contact_name', 'emergency_contact_phone'
                ]));
            } else {
                $employee->contact()->create($request->only([
                    'phone_number', 'address', 'emergency_contact_name', 'emergency_contact_phone'
                ]));
            }

            DB::commit();
            return response()->json($employee->load(['department', 'position', 'contact']), 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update employee', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $employee->delete();
        return response()->json(null, 204);
    }
}

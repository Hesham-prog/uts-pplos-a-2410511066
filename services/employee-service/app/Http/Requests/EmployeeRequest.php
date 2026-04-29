<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $employeeId = $this->route('employee');

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,' . $employeeId,
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'join_date' => 'required|date',
            'status' => 'sometimes|in:active,inactive,on_leave',
            // Contact rules
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
        ];
    }
}

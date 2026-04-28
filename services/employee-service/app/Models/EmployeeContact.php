<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeContact extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'employee_id', 'phone_number', 'address', 'emergency_contact_name', 'emergency_contact_phone'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}

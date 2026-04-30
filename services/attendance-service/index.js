const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const EMPLOYEE_SERVICE_URL = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:8000';

// Mock DB for attendances
let attendances = [];

// Create Attendance
app.post('/', (req, res) => {
    const { employee_id, status } = req.body;
    const newAttendance = { id: attendances.length + 1, employee_id, status, date: new Date() };
    attendances.push(newAttendance);
    res.status(201).json(newAttendance);
});

// Inter-service communication: Get employee details along with their attendance
app.get('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    
    // JWT validation is already handled by API Gateway!
    
    try {
        // Fetch employee details from Employee Service using Axios HTTP Client
        const response = await axios.get(`${EMPLOYEE_SERVICE_URL}/api/employees/${employee_id}`);
        const employeeData = response.data;
        
        // Find attendance records for this employee
        const employeeAttendances = attendances.filter(a => a.employee_id == employee_id);
        
        res.json({
            employee: employeeData,
            attendances: employeeAttendances
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'Employee not found in Employee Service' });
        }
        res.status(500).json({ error: 'Failed to communicate with Employee Service' });
    }
});

app.listen(PORT, () => {
    console.log(`Attendance Service running on http://localhost:${PORT}`);
});

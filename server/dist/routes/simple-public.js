"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/classes', async (req, res) => {
    try {
        const { tenantDomain } = req.query;
        if (!tenantDomain) {
            return res.status(400).json({
                success: false,
                error: 'Tenant domain is required'
            });
        }
        return res.json({
            success: true,
            data: {
                classes: [
                    {
                        id: '1',
                        name: 'Beginner BJJ',
                        description: 'Introduction to Brazilian Jiu-Jitsu fundamentals',
                        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
                        maxCapacity: 20,
                        currentEnrollment: 5,
                        price: 30.00,
                        modality: 'Brazilian Jiu-Jitsu'
                    }
                ]
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch classes'
        });
    }
});
router.post('/bookings', async (req, res) => {
    try {
        const { tenantDomain, classId, studentName, studentEmail, bookingDate, notes } = req.body;
        if (!tenantDomain || !classId || !studentName || !studentEmail) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        return res.status(201).json({
            success: true,
            message: 'Booking request submitted successfully',
            data: {
                bookingId: 'temp-booking-id',
                status: 'pending'
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to submit booking'
        });
    }
});
exports.default = router;
//# sourceMappingURL=simple-public.js.map
const express = require('express');
const router = express.Router();

// Mock / Sample Data from Prakhar's Resume
const projects = [
  {
    id: 1,
    title: 'Gym Membership Management System',
    tags: ['Node.js', 'Express.js', 'MongoDB', 'HTML/CSS/JS'],
    year: '2026',
    description: 'Developed a Full Stack Gym Membership Management System with member registration, attendance, and analytics.',
    github: 'https://github.com/prakhar987654321'
  },
  {
    id: 2,
    title: 'Hospital Bed and Blood Bank Availability',
    tags: ['Node.js', 'MongoDB', 'Express.js', 'JavaScript'],
    year: '2026',
    description: 'Centralized portal to inspect real-time hospital bed allocations (ICU, ventilators) and blood bank inventories.',
    github: 'https://github.com/prakhar987654321'
  }
];

// GET /api/projects
router.get('/', (req, res) => {
  res.json({ success: true, count: projects.length, data: projects });
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Subject = require('./models/Subject');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Allows React (localhost:3000) to call backend
app.use(express.json());  // Parses JSON bodies

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB error:', err));

// === SEEDING DEMO DATA (Runs on startup if DB empty) ===
const seedData = async () => {
  try {
    // Seed Users (only if no users exist)
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const demoUsers = [
        {
          name: 'Admin User',
          username: 'admin',
          password: 'admin123',  // Plaintext for demo—hash in prod!
          role: 'admin'
        },
        {
          name: 'Teacher One',
          username: 'teacher1',
          password: 'teacher123',
          role: 'teacher',
          subjects: ['DSA', 'OOP']  // Matches demo subjects
        },
        {
          name: 'Student One',
          username: 'student1',
          password: 'student123',
          role: 'student',
          class: '5A'
        }
      ];
      await User.insertMany(demoUsers);
      console.log('Seeded demo users!');
    } else {
      console.log('Users already exist—skipping seed.');
    }

    // Seed Subjects (only if no subjects exist)
    const subjectCount = await Subject.countDocuments();
    if (subjectCount === 0) {
      const demoSubjects = [
        {
          name: 'DSA',
          fullName: 'Data Structures & Algorithms',
          credits: 4,
          semester: 5
        },
        {
          name: 'OOP',
          fullName: 'Object Oriented Programming',
          credits: 3,
          semester: 5
        },
        {
          name: 'DBMS',
          fullName: 'Database Management Systems',
          credits: 3,
          semester: 7
        },
        {
          name: 'CN',
          fullName: 'Computer Networks',
          credits: 4,
          semester: 7
        }
      ];
      await Subject.insertMany(demoSubjects);
      console.log('Seeded demo subjects!');
    } else {
      console.log('Subjects already exist—skipping seed.');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

// Run seeding after DB connection
mongoose.connection.on('connected', seedData);

// === USERS ROUTES (for Admin Panel) ===
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === SUBJECTS ROUTES ===
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subjects', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed route (manual trigger if needed)
app.get('/api/seed', async (req, res) => {
  await seedData();
  res.json({ message: 'Seeding complete! Check console for details.' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
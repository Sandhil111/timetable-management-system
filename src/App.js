import React, { useState, useEffect } from 'react';
import { Calendar, Users, BookOpen, Clock, LogOut, Plus, Edit2, Trash2, Save, X, AlertCircle, CheckCircle, UserCheck, UserX } from 'lucide-react';

// Constants
const API_BASE = 'http://localhost:5000/api';
const CLASSES = ['5A', '5B', '7A', '7B']; // Hardcoded as they don't change

const PERIOD_TIMES = [
  { period: 1, start: '9:00 AM', end: '9:45 AM' },
  { period: 2, start: '9:45 AM', end: '10:30 AM' },
  { period: 'break', start: '10:30 AM', end: '10:45 AM', label: 'Short Break' },
  { period: 3, start: '10:45 AM', end: '11:30 AM' },
  { period: 4, start: '11:30 AM', end: '12:15 PM' },
  { period: 'lunch', start: '12:15 PM', end: '1:00 PM', label: 'Lunch Break' },
  { period: 5, start: '1:00 PM', end: '1:45 PM' },
  { period: 6, start: '1:45 PM', end: '2:30 PM' },
  { period: 7, start: '2:30 PM', end: '3:15 PM' }
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Timetable Generator (unchanged)
const generateTimetable = (subjects, teachers, className) => {

  const semesterMap = {
    '5A': 5,
    '5B': 5,
    '7A': 7,
    '7B': 7,
    '8A': 8,
    '8B': 8
  };

  const semester = semesterMap[className];

  const semesterSubjects = subjects.filter(
    s => Number(s.semester) === Number(semester)
  );

  const schedule = {};

  DAYS.forEach(day => {
    schedule[day] = {};
  });

  const subjectPool = [];

  semesterSubjects.forEach(subject => {

    let periodsPerWeek = 0;

    if (subject.credits === 4) periodsPerWeek = 5;
    else if (subject.credits === 3) periodsPerWeek = 4;
    else if (subject.credits === 2) periodsPerWeek = 3;
    else periodsPerWeek = 2;

    for (let i = 0; i < periodsPerWeek; i++) {
      subjectPool.push(subject);
    }
  });

  subjectPool.sort(() => Math.random() - 0.5);

  let index = 0;

  DAYS.forEach(day => {

    let dayCount = Math.floor(Math.random() * 2) + 5;

    for (let period = 1; period <= dayCount; period++) {

      if (index >= subjectPool.length) break;

      const subject = subjectPool[index];

      const teacher = teachers.find(
        t => t.subjects?.includes(subject.name)
      );

      if (!teacher) continue;

      schedule[day][period] = {
        subject: subject.name,
        fullName: subject.fullName,
        teacher: teacher.name,
        teacherId: teacher._id || teacher.id
      };

      index++;
    }
  });

  return schedule;
};

// Utility to fetch data
const fetchWithError = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} - ${await res.text()}`);
  }
  return res.json();
};

// Login Component (updated to use fetched users)
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    onLogin(username, password, setError);
    return false;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Calendar className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Timetable System</h1>
          <p className="text-gray-600 mt-2">Login to continue</p>
        </div>
       
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter username"
            />
          </div>
         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Login
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm border border-gray-200">
          <p className="font-semibold mb-3 text-gray-700 border-b pb-2">Demo Credentials:</p>
          <ul className="space-y-2">
            <li><span className="font-semibold text-blue-600">Admin:</span> <code className="bg-white px-2 py-1 rounded-md text-gray-800 shadow-inner">admin / admin123</code></li>
            <li><span className="font-semibold text-blue-600">Teacher:</span> <code className="bg-white px-2 py-1 rounded-md text-gray-800 shadow-inner">teacher1 / teacher123</code></li>
            <li><span className="font-semibold text-blue-600">Student:</span> <code className="bg-white px-2 py-1 rounded-md text-gray-800 shadow-inner">student1 / student123</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard (updated with API calls)
const AdminDashboard = ({ data, setData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('timetables');
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState('5A');
  const [absenceForm, setAbsenceForm] = useState({ teacherId: '', date: '', periods: [] });
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // {type: 'user'|'subject', id, role?}

  const teachers = data.users.filter(u => u.role === 'teacher');
  const students = data.users.filter(u => u.role === 'student');
  const allSubjects = data.subjects;
  const allClasses = CLASSES;

  const getTeacherNameById = (id) => {
    const teacher = data.users.find(u => (u._id || u.id) === id);
    return teacher ? teacher.name : 'Unknown Teacher';
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const confirmDeleteAction = async () => {
    if (confirmDelete.type === 'user') {
      await handleDeleteUser(confirmDelete.id, confirmDelete.role);
    } else if (confirmDelete.type === 'subject') {
      await handleDeleteSubject(confirmDelete.id);
    }
    setConfirmDelete(null);
  };

  // API Handlers for Users
  const handleSaveUser = async (user) => {
    setLoading(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${API_BASE}/users/${editingItem._id || editingItem.id}` : `${API_BASE}/users`;
      const res = await fetchWithError(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      // Refetch users to update state
      const users = await fetchWithError(`${API_BASE}/users`);
      setData({ ...data, users });
      showNotification(`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} ${editingItem ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setEditingItem(null);
      setShowForm(false);
    }
  };

  const handleDeleteUser = async (id, role) => {
    setLoading(true);
    try {
      await fetchWithError(`${API_BASE}/users/${id}`, { method: 'DELETE' });
      const users = await fetchWithError(`${API_BASE}/users`);
      setData({ ...data, users });
      showNotification(`${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully!`);
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const requestDeleteUser = (id, role) => {
    setConfirmDelete({ type: 'user', id, role });
  };

  // API Handlers for Subjects
  const handleAddSubject = async (subject) => {
    setLoading(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${API_BASE}/subjects/${editingItem._id || editingItem.id}` : `${API_BASE}/subjects`;
      const res = await fetchWithError(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subject)
      });
      // Refetch subjects
      const subjects = await fetchWithError(`${API_BASE}/subjects`);
      setData({ ...data, subjects });
      showNotification(`Subject ${editingItem ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setEditingItem(null);
      setShowForm(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    setLoading(true);
    try {
      await fetchWithError(`${API_BASE}/subjects/${id}`, { method: 'DELETE' });
      const subjects = await fetchWithError(`${API_BASE}/subjects`);
      setData({ ...data, subjects });
      showNotification('Subject deleted successfully!');
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const requestDeleteSubject = (id) => {
    setConfirmDelete({ type: 'subject', id });
  };

  // Timetable Generation (unchanged, in-memory)
  const generateTimetables = () => {
    const timetables = {};
    CLASSES.forEach(cls => {
      timetables[cls] = generateTimetable(data.subjects, teachers, cls);
    });
    setData({ ...data, timetables });
    showNotification('Timetables generated successfully!');
  };

  // Absence logic (in-memory for now)
  const findSubstitutes = (absence) => {
    const substitutions = [];
    const teacher = teachers.find(t => (t._id || t.id) === parseInt(absence.teacherId));
   
    const absenceDate = new Date(absence.date + 'T00:00:00');
    const dayOfWeek = absenceDate.toLocaleDateString('en-US', { weekday: 'long' });

    absence.periods.forEach(period => {
      CLASSES.forEach(cls => {
        if (data.timetables &&
            data.timetables[cls] &&
            data.timetables[cls][dayOfWeek] &&
            data.timetables[cls][dayOfWeek][period] &&
            data.timetables[cls][dayOfWeek][period].teacherId === (teacher._id || teacher.id))
        {
          const slot = data.timetables[cls][dayOfWeek][period];
         
          const availableTeachers = teachers.filter(t => {
            const tid = t._id || t.id;
            if (tid === (teacher._id || teacher.id)) return false;

            const isFree = !CLASSES.some(c => {
              return data.timetables[c] &&
                     data.timetables[c][dayOfWeek] &&
                     data.timetables[c][dayOfWeek][period] &&
                     data.timetables[c][dayOfWeek][period].teacherId === tid;
            });

            const canTeach = t.subjects && t.subjects.includes(slot.subject);

            return isFree && canTeach;
          });

          if (availableTeachers.length > 0) {
            const subTeacher = availableTeachers[0];
            substitutions.push({
              id: Date.now() + Math.random(),
              absenceId: absence.id,
              class: cls,
              day: dayOfWeek,
              period,
              subject: slot.subject,
              originalTeacher: teacher.name,
              substituteTeacher: subTeacher.name,
              substituteId: subTeacher._id || subTeacher.id,
              date: absence.date
            });
          }
        }
      });
    });

    return substitutions;
  };

  const handleAbsence = () => {
    if (!absenceForm.teacherId || !absenceForm.date || absenceForm.periods.length === 0) {
      showNotification('Please fill all absence details');
      return;
    }

    const teacher = teachers.find(t => (t._id || t.id) === parseInt(absenceForm.teacherId));
    const newAbsence = { ...absenceForm, id: Date.now(), teacherName: teacher.name };
   
    const substitutions = findSubstitutes(newAbsence);
   
    setData({
      ...data,
      absences: [...data.absences, newAbsence],
      substitutions: [
        ...data.substitutions.filter(s => s.absenceId !== newAbsence.id),
        ...substitutions
      ]
    });

    setAbsenceForm({ teacherId: '', date: '', periods: [] });
    showNotification(`Absence marked for ${teacher.name}. Assigned ${substitutions.length} substitutes.`);
  };

  // Render Timetable (updated for _id)
  const renderTimetable = (className) => {
    if (!data.timetables || !data.timetables[className]) {
      return (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Calendar className="w-8 h-8 mx-auto mb-2" />
          No timetable generated yet. Click 'Generate All Timetables' above.
        </div>
      );
    }

    const timetable = data.timetables[className];

    return (
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full border-collapse bg-white">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-blue-700 p-3 font-semibold sticky left-0 bg-blue-600 w-32">Time</th>
              {DAYS.map(day => (
                <th key={day} className="border border-blue-700 p-3 font-semibold">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIOD_TIMES.map((time, idx) => (
              <tr key={idx} className={time.period === 'break' || time.period === 'lunch' ? 'bg-gray-100' : 'hover:bg-blue-50'}>
                <td className="border border-gray-200 p-3 font-medium text-sm sticky left-0 bg-white z-10 w-32">
                  {time.label ? (
                    <div className="text-center">
                      <div className="font-bold text-orange-600">{time.label}</div>
                      <div className="text-xs text-gray-600">{time.start} - {time.end}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold">Period {time.period}</div>
                      <div className="text-xs text-gray-600">{time.start} - {time.end}</div>
                    </div>
                  )}
                </td>
               
                {DAYS.map(day => {
                  const currentSlot = timetable[day] && timetable[day][time.period];
                  const substitution = data.substitutions.find(sub =>
                    sub.class === className &&
                    sub.date === new Date().toISOString().split('T')[0] &&
                    sub.day === day &&
                    sub.period === time.period
                  );

                  return (
                    <td key={day} className="border border-gray-200 p-2 min-w-[120px]">
                      {time.period === 'break' || time.period === 'lunch' ? (
                        <div className="text-center text-gray-500 font-medium">{time.label}</div>
                      ) : currentSlot ? (
                        <div className={`p-2 rounded ${substitution ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-blue-50'}`}>
                          <div className="font-bold text-blue-800 text-sm">{currentSlot.subject}</div>
                          {substitution ? (
                            <div className="text-xs text-red-600 mt-1">
                              <span className="font-semibold">SUB:</span> {substitution.substituteTeacher}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-600 mt-1">{getTeacherNameById(currentSlot.teacherId)}</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center text-sm">Free</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const shouldShowUserForm = showForm && (activeTab === 'teachers' || activeTab === 'students');
  const shouldShowSubjectForm = showForm && activeTab === 'subjects';

  return (
    <>
      <div className="min-h-screen bg-gray-100 font-sans">
        {notification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-bounce">
            <CheckCircle className="w-5 h-5" />
            {notification}
          </div>
        )}

        <nav className="bg-white shadow-lg sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Admin Dashboard
            </h1>
            <button onClick={onLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 transition transform hover:scale-105 p-2 rounded-lg">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex gap-3 mb-6 p-2 bg-white rounded-xl shadow overflow-x-auto">
            {[
              { id: 'timetables', label: 'Timetables', icon: Calendar },
              { id: 'subjects', label: 'Subjects', icon: BookOpen },
              { id: 'teachers', label: 'Teachers', icon: UserCheck },
              { id: 'students', label: 'Students', icon: UserX },
              { id: 'absences', label: 'Absences & Subs', icon: AlertCircle },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setShowForm(false); setEditingItem(null); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'timetables' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Class Timetable View</h2>
                  <div className="flex gap-3 items-center">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      {CLASSES.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                    <button
                      onClick={generateTimetables}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 flex items-center gap-2 transition transform hover:scale-[1.02]"
                    >
                      <Plus className="w-5 h-5" />
                      Generate All
                    </button>
                  </div>
                </div>
               
                <h3 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">Timetable for Class {selectedClass}</h3>
                {renderTimetable(selectedClass)}
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold">Subjects Management</h2>
                <button
                  onClick={() => { setShowForm(true); setEditingItem(null); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2 transition"
                  disabled={loading}
                >
                  <Plus className="w-5 h-5" />
                  Add Subject
                </button>
              </div>

              {shouldShowSubjectForm && (
                <div className="mb-6">
                  <SubjectForm
                    subject={editingItem}
                    onSave={handleAddSubject}
                    onCancel={() => { setShowForm(false); setEditingItem(null); }}
                    loading={loading}
                  />
                </div>
              )}

              <div className="grid gap-4 mt-6">
                {data.subjects.map(subject => (
                  <div key={subject._id || subject.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-blue-100 transition">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="font-bold text-lg text-gray-800">{subject.name} - {subject.fullName}</h3>
                      <p className="text-sm text-gray-600">Credits: {subject.credits} | Semester: {subject.semester}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(subject); setShowForm(true); }}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-200 transition"
                        aria-label="Edit Subject"
                        disabled={loading}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => requestDeleteSubject(subject._id || subject.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-200 transition"
                        aria-label="Delete Subject"
                        disabled={loading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold">Teachers List ({teachers.length})</h2>
                <button
                  onClick={() => { setShowForm(true); setEditingItem(null); }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 flex items-center gap-2 transition"
                  disabled={loading}
                >
                  <Plus className="w-5 h-5" />
                  Add Teacher
                </button>
              </div>

              {shouldShowUserForm && (
                <div className="mb-6">
                  <UserForm
                    user={editingItem}
                    role="teacher"
                    subjects={allSubjects}
                    classes={allClasses}
                    onSave={handleSaveUser}
                    onCancel={() => { setShowForm(false); setEditingItem(null); }}
                    loading={loading}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map(teacher => (
                  <div key={teacher._id || teacher.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-blue-800">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">User: {teacher.username}</p>
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-semibold">Teaches:</span> {teacher.subjects?.join(', ') || 'N/A'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(teacher); setShowForm(true); }}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-200 transition"
                        aria-label="Edit Teacher"
                        disabled={loading}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => requestDeleteUser(teacher._id || teacher.id, 'teacher')}
                        className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-200 transition"
                        aria-label="Delete Teacher"
                        disabled={loading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold">Students List ({students.length})</h2>
                <button
                  onClick={() => { setShowForm(true); setEditingItem(null); }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 flex items-center gap-2 transition"
                  disabled={loading}
                >
                  <Plus className="w-5 h-5" />
                  Add Student
                </button>
              </div>

              {shouldShowUserForm && (
                <div className="mb-6">
                  <UserForm
                    user={editingItem}
                    role="student"
                    subjects={allSubjects}
                    classes={allClasses}
                    onSave={handleSaveUser}
                    onCancel={() => { setShowForm(false); setEditingItem(null); }}
                    loading={loading}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map(student => (
                  <div key={student._id || student.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-blue-800">{student.name}</h3>
                      <p className="text-sm text-gray-600">User: {student.username}</p>
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-semibold">Class:</span> {student.class}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(student); setShowForm(true); }}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-200 transition"
                        aria-label="Edit Student"
                        disabled={loading}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => requestDeleteUser(student._id || student.id, 'student')}
                        className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-200 transition"
                        aria-label="Delete Student"
                        disabled={loading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'absences' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Mark Teacher Absence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Select Teacher</label>
                      <select
                        value={absenceForm.teacherId}
                        onChange={(e) => setAbsenceForm({ ...absenceForm, teacherId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Choose teacher...</option>
                        {teachers.map(t => (
                          <option key={t._id || t.id} value={t._id || t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Date</label>
                      <input
                        type="date"
                        value={absenceForm.date}
                        onChange={(e) => setAbsenceForm({ ...absenceForm, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Periods (hold Ctrl/Cmd to select multiple)</label>
                      <select
                        multiple
                        value={absenceForm.periods.map(String)}
                        onChange={(e) => setAbsenceForm({
                          ...absenceForm,
                          periods: Array.from(e.target.selectedOptions, option => parseInt(option.value))
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg h-36 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map(p => (
                          <option key={p} value={p}>Period {p} ({PERIOD_TIMES.find(t => t.period === p)?.start})</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleAbsence}
                      className="w-full bg-orange-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-orange-700 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-5 h-5" />
                      Mark Absence & Assign Substitutes
                    </button>
                  </div>
                 
                  <div className="space-y-3 p-4 border rounded-xl bg-gray-50 h-full max-h-[500px] overflow-y-auto">
                      <h3 className="font-bold text-lg text-gray-800 sticky top-0 bg-gray-50 pb-2 border-b">Recent Absences</h3>
                      {data.absences.slice(-5).reverse().map(abs => (
                          <div key={abs.id} className="p-3 border rounded-lg bg-white shadow-sm">
                              <p className="font-semibold text-red-700">{abs.teacherName} is Absent</p>
                              <p className="text-sm text-gray-600">Date: {abs.date}</p>
                              <p className="text-sm text-gray-600">Periods: {abs.periods.join(', ')}</p>
                          </div>
                      ))}
                      {data.absences.length === 0 && <p className="text-gray-500 text-center py-4">No absences marked.</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Substitution Assignments</h2>
                <div className="space-y-4">
                  {data.substitutions.map(sub => (
                    <div key={sub.id} className="p-4 border rounded-xl bg-yellow-50 border-l-4 border-yellow-500">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                        <div className="col-span-3">
                          <strong className="text-blue-800">Class: {sub.class}</strong> |
                          <strong className="text-blue-800 ml-2">Period: {sub.period}</strong> ({sub.day})
                        </div>
                        <div className="sm:col-span-1"><strong>Date:</strong> {sub.date}</div>
                        <div className="sm:col-span-2"><strong>Subject:</strong> {sub.subject}</div>
                        <div className="sm:col-span-1"><strong>Original:</strong> <span className="text-red-600">{sub.originalTeacher}</span></div>
                        <div className="sm:col-span-2"><strong>Substitute:</strong> <span className="text-green-600 font-semibold">{sub.substituteTeacher}</span></div>
                      </div>
                    </div>
                  ))}
                  {data.substitutions.length === 0 && (
                    <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No substitutions assigned yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Confirm Delete</h3>
              <p className="mb-6 text-gray-600">
                {confirmDelete.type === 'user'
                  ? `Are you sure you want to delete this ${confirmDelete.role}?`
                  : 'Are you sure you want to delete this subject? This action cannot be undone.'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAction}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Updated UserForm (with loading prop)
const UserForm = ({ user, role, subjects, classes, onSave, onCancel, loading = false }) => {
  const isTeacher = role === 'teacher';
  const initialSubjects = user?.subjects || [];
  const initialClass = user?.class || classes[0] || '';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    password: user?.password || '',
    role,
    subjects: initialSubjects,
    class: initialClass,
  });

  const handleSubjectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, subjects: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) {
      console.error("Please fill in Name, Username, and Password.");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-green-50 p-6 rounded-xl space-y-4 border border-green-200 shadow-inner">
      <h3 className="text-xl font-bold text-green-800">{user ? `Edit ${role}` : `Add New ${role}`}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="text"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            placeholder="Min 6 characters (Demo)"
            required
            disabled={loading}
          />
        </div>
       
        {isTeacher && (
          <div>
            <label className="block text-sm font-medium mb-2">Subjects Taught (Hold Ctrl/Cmd)</label>
            <select
              multiple
              value={formData.subjects}
              onChange={handleSubjectChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 focus:ring-green-500 focus:border-green-500"
              disabled={loading}
            >
              {subjects.map(s => (
                <option key={s._id || s.id} value={s.name}>{s.name} ({s.fullName})</option>
              ))}
            </select>
          </div>
        )}

        {!isTeacher && (
          <div>
            <label className="block text-sm font-medium mb-2">Class</label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              disabled={loading}
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold transition disabled:opacity-50"
          disabled={loading}
        >
          <Save className="w-5 h-5" />
          {user ? `Update ${role}` : `Save ${role}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2 font-semibold transition"
          disabled={loading}
        >
          <X className="w-5 h-5" />
          Cancel
        </button>
      </div>
    </form>
  );
};

// Updated SubjectForm (with loading)
const SubjectForm = ({ subject, onSave, onCancel, loading = false }) => {
  const [formData, setFormData] = useState(
    subject || { name: '', fullName: '', credits: 3, semester: 5 }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 p-6 rounded-xl space-y-4 border border-blue-200 shadow-inner">
      <h3 className="text-xl font-bold text-blue-800">{subject ? 'Edit Subject' : 'Add New Subject'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-2">Subject Code</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., DSA"
            required
            disabled={loading}
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Data Structures & Algorithms"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Credits</label>
          <select
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Semester</label>
          <select
  value={formData.semester}
  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
  disabled={loading}
>
  <option value={5}>5th Semester</option>
  <option value={7}>7th Semester</option>
  <option value={8}>8th Semester</option>
</select>
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold transition disabled:opacity-50"
          disabled={loading}
        >
          <Save className="w-5 h-5" />
          {subject ? 'Update Subject' : 'Save Subject'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2 font-semibold transition"
          disabled={loading}
        >
          <X className="w-5 h-5" />
          Cancel
        </button>
      </div>
    </form>
  );
};

// Teacher Dashboard (updated for _id)
const TeacherDashboard = ({ user, data, onLogout }) => {
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() - 1] || DAYS[0]);
  const teacher = data.users.find(u => (u._id || u.id) === (user._id || user.id));

  const getTeacherNameById = (id) => {
    const foundTeacher = data.users.find(u => (u._id || u.id) === id);
    return foundTeacher ? foundTeacher.name : 'Unknown Teacher';
  };

  const getTeacherSchedule = () => {
    const schedule = {};
    DAYS.forEach(day => {
      schedule[day] = [];
      if (data.timetables) {
        CLASSES.forEach(cls => {
          if (data.timetables[cls] && data.timetables[cls][day]) {
            Object.entries(data.timetables[cls][day]).forEach(([period, slot]) => {
              if (slot.teacherId === (teacher._id || teacher.id)) {
                schedule[day].push({
                  period: parseInt(period),
                  class: cls,
                  subject: slot.subject,
                  fullName: slot.fullName,
                  teacher: getTeacherNameById(slot.teacherId)
                });
              }
            });
          }
        });
        schedule[day].sort((a, b) => a.period - b.period);
      }
    });
    return schedule;
  };

  const getSubstitutions = () => {
    return data.substitutions.filter(sub => sub.substituteId === (teacher._id || teacher.id));
  };

  const schedule = getTeacherSchedule();
  const substitutions = getSubstitutions();

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Teacher Dashboard
            </h1>
            <p className="text-gray-600 font-semibold">{teacher?.name}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 transition transform hover:scale-105 p-2 rounded-lg">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">My Expertise</h2>
          <div className="flex flex-wrap gap-3">
            {teacher?.subjects?.map((subject, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm shadow-sm">
                {subject}
              </span>
            ))}
          </div>
        </div>

        {substitutions.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-yellow-800 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Urgent: Upcoming Substitution Duty
            </h2>
            <div className="space-y-3">
              {substitutions.map(sub => (
                <div key={sub.id} className="bg-white p-4 rounded-lg shadow-md border-2 border-yellow-300">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Date:</strong> <span className="text-blue-700">{sub.date}</span></div>
                    <div><strong>Day:</strong> <span className="font-semibold">{sub.day}</span></div>
                    <div><strong>Time:</strong> Period {sub.period}</div>
                    <div><strong>Class:</strong> <span className="text-red-600 font-semibold">{sub.class}</span></div>
                    <div className="col-span-2"><strong>Subject:</strong> {sub.subject}</div>
                    <div className="col-span-2 text-gray-600 italic">Covering for: {sub.originalTeacher}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">My Weekly Schedule</h2>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 shadow-sm ${
                  selectedDay === day ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {schedule[selectedDay].length > 0 ? (
              schedule[selectedDay].map((item, idx) => {
                const periodTime = PERIOD_TIMES.find(p => p.period === item.period);
                const isSubstitution = substitutions.some(sub =>
                  sub.day === selectedDay &&
                  sub.period === item.period &&
                  sub.originalTeacher === item.teacher
                );

                return (
                  <div key={idx} className={`border rounded-xl p-4 shadow-md ${isSubstitution ? 'bg-red-100 border-red-500' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-blue-800">{item.subject} <span className="text-sm font-normal">({item.class})</span></h3>
                        <p className="text-sm text-gray-600">{item.fullName}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">P{item.period}</div>
                        <div className="text-xs text-gray-600">{periodTime?.start} - {periodTime?.end}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">Enjoy your free day or prepare for {selectedDay} classes!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Student Dashboard (updated for _id)
const StudentDashboard = ({ user, data, onLogout }) => {
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() - 1] || DAYS[0]);
  const student = data.users.find(u => (u._id || u.id) === (user._id || user.id));
  const className = student?.class;

  const getTeacherNameById = (id) => {
    const teacher = data.users.find(u => (u._id || u.id) === id);
    return teacher ? teacher.name : 'Unknown Teacher';
  };

  const renderDaySchedule = (day) => {
    if (!data.timetables || !data.timetables[className]) {
      return (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Calendar className="w-8 h-8 mx-auto mb-2" />
          Timetable for your class is not yet available.
        </div>
      );
    }

    const daySchedule = data.timetables[className][day];
    if (!daySchedule) {
      return <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">No classes scheduled for {day}</p>;
    }

    return (
      <div className="space-y-3">
        {PERIOD_TIMES.map((time, idx) => {
          if (time.period === 'break' || time.period === 'lunch') {
            return (
              <div key={idx} className="bg-orange-100 border-l-4 border-orange-400 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-orange-800 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {time.label}
                  </h3>
                  <span className="text-sm text-gray-600">{time.start} - {time.end}</span>
                </div>
              </div>
            );
          }

          const slot = daySchedule[time.period];
          const substitution = data.substitutions.find(sub =>
            sub.class === className &&
            sub.day === day &&
            sub.period === time.period
          );
         
          const isFree = !slot;

          return (
            <div key={idx} className={`border rounded-xl p-4 shadow-md transition ${isFree ? 'bg-gray-100 border-gray-300' : substitution ? 'bg-red-100 border-red-500' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {isFree ? 'Free Period' : slot.subject}
                  </h3>
                  {!isFree && (
                    <>
                      <p className="text-sm text-gray-600">{slot.fullName}</p>
                      <p className={`text-sm mt-1 font-medium ${substitution ? 'text-red-700' : 'text-blue-700'}`}>
                        Teacher: {substitution ? `${substitution.substituteTeacher} (SUB)` : getTeacherNameById(slot.teacherId)}
                      </p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">P{time.period}</div>
                  <div className="text-sm text-gray-600">{time.start} - {time.end}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Student Dashboard
            </h1>
            <p className="text-gray-600 font-semibold">{student?.name} - Class {className}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 transition transform hover:scale-105 p-2 rounded-lg">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">My Timetable - Class {className}</h2>
         
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 shadow-sm ${
                  selectedDay === day ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {renderDaySchedule(selectedDay)}
        </div>
      </div>
    </div>
  );
};

// Main App Component (updated with API fetch)
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [appData, setAppData] = useState({ users: [], subjects: [], classes: CLASSES, absences: [], substitutions: [], timetables: {} });
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [users, subjects] = await Promise.all([
          fetchWithError(`${API_BASE}/users`),
          fetchWithError(`${API_BASE}/subjects`)
        ]);
        setAppData({ users, subjects, classes: CLASSES, absences: [], substitutions: [], timetables: {} });

        // Auto-generate timetables if needed
        const teachers = users.filter(u => u.role === 'teacher');
        const initialTimetables = {};
        CLASSES.forEach(cls => {
          initialTimetables[cls] = generateTimetable(subjects, teachers, cls);
        });
        setAppData(prev => ({ ...prev, timetables: initialTimetables }));
      } catch (err) {
        console.error('Failed to load data:', err);
        // Fallback to initial data if backend down
        setAppData({
          users: [], // Or load INITIAL_DATA.users if you want fallback
          subjects: [], // Same for subjects
          classes: CLASSES,
          absences: [],
          substitutions: [],
          timetables: {}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogin = async (username, password, setError) => {
  try {
    const users = await fetchWithError(`${API_BASE}/users`);

    console.log("Users from API:", users);

    const user = users.find(
      u => u.username?.trim() === username.trim()
    );

    if (!user) {
      setError("User not found");
      return;
    }

    if (user.password !== password) {
      setError("Wrong password");
      return;
    }

    setCurrentUser(user);
    setError("");
  } catch (err) {
    console.error(err);
    setError("Login failed");
  }
};
  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard data={appData} setData={setAppData} onLogout={handleLogout} />;
  }

  if (currentUser.role === 'teacher') {
    return <TeacherDashboard user={currentUser} data={appData} onLogout={handleLogout} />;
  }

  if (currentUser.role === 'student') {
    return <StudentDashboard user={currentUser} data={appData} onLogout={handleLogout} />;
  }

  return null;
};

export default App;
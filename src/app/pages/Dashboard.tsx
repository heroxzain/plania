import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, CheckCircle2, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock data - this will be replaced by backend API
const mockWeeklySchedule = [
  { day: 'Monday', tasks: 'Mathematics Ch. 1-3, Physics Lab Report' },
  { day: 'Tuesday', tasks: 'Chemistry Organic Compounds, English Essay' },
  { day: 'Wednesday', tasks: 'Mathematics Ch. 4-5, Computer Science Project' },
  { day: 'Thursday', tasks: 'Physics Mechanics, Chemistry Practical' },
  { day: 'Friday', tasks: 'English Literature Review, Mathematics Practice' },
  { day: 'Saturday', tasks: 'Computer Science Algorithms, Physics Revision' },
  { day: 'Sunday', tasks: 'General Revision, Mock Tests' }
];

const mockDailyTasks = [
  { id: 1, task: 'Complete Mathematics Assignment', completed: false },
  { id: 2, task: 'Study Physics Chapter 5', completed: true },
  { id: 3, task: 'Review Chemistry Notes', completed: false },
  { id: 4, task: 'Practice Programming Questions', completed: false },
  { id: 5, task: 'Prepare for English Presentation', completed: true }
];

export default function Dashboard() {
  const { isAuthenticated, user, subjects } = useAuth();
  const [dailyTasks, setDailyTasks] = useState(mockDailyTasks);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress based on completed tasks and days until exams
    // This will be replaced with actual backend calculation
    const completedTasks = dailyTasks.filter(t => t.completed).length;
    const totalTasks = dailyTasks.length;
    const taskProgress = (completedTasks / totalTasks) * 100;
    
    // Calculate days until nearest exam
    let examProgress = 50; // Default
    if (subjects.length > 0) {
      const now = new Date();
      const examDates = subjects.map(s => new Date(s.examDate));
      const nearestExam = examDates.sort((a, b) => a.getTime() - b.getTime())[0];
      const daysUntilExam = Math.max(0, Math.ceil((nearestExam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      
      // More days = lower progress, fewer days = higher progress needed
      examProgress = Math.min(100, 100 - (daysUntilExam * 2));
    }
    
    // Combine both factors
    setProgress(Math.round((taskProgress + examProgress) / 2));
  }, [dailyTasks, subjects]);

  const toggleTask = (id: number) => {
    setDailyTasks(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {!isAuthenticated ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
                <div className="mb-6">
                  <Calendar className="w-16 h-16 mx-auto text-indigo-600" />
                </div>
                <h2 className="text-2xl mb-4 text-gray-800">Welcome to PLANiA</h2>
                <p className="text-gray-600 mb-8">
                  Your AI-powered study companion. Please sign in or create an account to access your personalized study planner and track your progress.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Demo credentials:</p>
                  <p className="mt-1">Email: demo@plania.com</p>
                  <p>Password: demo123</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl text-gray-800">
                  Welcome back, <span className="text-indigo-600">{user?.displayName}</span>! 👋
                </h2>
                <p className="text-gray-600 mt-2">Here's your study progress and schedule</p>
              </div>

              {/* Progress Bar Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl text-gray-800">Overall Progress</h3>
                </div>
                <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${progress}%` }}
                  >
                    <span className="text-white text-sm px-2">{progress}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Based on completed tasks and time until exams
                </p>
              </div>

              {/* Weekly Schedule Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl text-gray-800">Weekly Schedule</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                  {mockWeeklySchedule.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200 hover:shadow-lg transition-shadow"
                    >
                      <h4 className="text-indigo-700 mb-2">{item.day}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.tasks}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 italic">
                  * Schedule is AI-generated based on your subjects and exam dates
                </p>
              </div>

              {/* Daily Tasks Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl text-gray-800">Today's Tasks</h3>
                </div>
                <div className="space-y-3">
                  {dailyTasks.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => toggleTask(item.id)}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleTask(item.id)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <span
                        className={`flex-1 ${
                          item.completed
                            ? 'line-through text-gray-400'
                            : 'text-gray-800'
                        }`}
                      >
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 italic">
                  * Tasks are updated daily from your weekly schedule
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Card,
  Button,
  Slider,} from '../components/ui/index.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select.jsx';
import { Label } from '../components/ui/label.jsx';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSkipPlanner } from '../services/skipPlanner';
import { Loader, Info, ChevronDown, ChevronUp, ArrowRight, Calculator, BookOpen, Lightbulb, Clock, Shield } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { useNavigate } from 'react-router-dom';

// Subject Card Component
const SubjectCard = ({ subject, isFlipped, flipCard, priority, skipsDistribution, reasoning, changePriority }) => {
  const getTypeColor = (type) => {
    switch(type) {
      case 'THEORY': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'LAB': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityGradient = (priority) => {
    switch(priority) {
      case 'High': return 'from-red-500 to-pink-500';
      case 'Medium': return 'from-amber-500 to-orange-500';
      case 'Low': return 'from-emerald-500 to-teal-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getAttendanceStatus = (attendance) => {
    if (attendance >= 90) return { color: 'text-emerald-600', message: 'Excellent' };
    if (attendance >= 80) return { color: 'text-blue-600', message: 'Good' };
    if (attendance >= 75) return { color: 'text-amber-600', message: 'Borderline' };
    return { color: 'text-red-600', message: 'Low' };
  };

  const attendanceStatus = getAttendanceStatus(subject.attendance);
  const hasSkips = skipsDistribution && skipsDistribution[subject.id] > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl overflow-hidden shadow-lg border ${
        hasSkips ? 'border-indigo-300' : 'border-gray-100'
      } hover:shadow-xl transition-all duration-300`}
    >
      <div className="relative">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        
        {/* Skip Badge */}
        {hasSkips && (
          <div className="absolute -top-1 -right-1 w-auto">
            <div className="relative">
              <div className="absolute -inset-2 bg-indigo-300 opacity-20 rounded-full blur-md"></div>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg transform -rotate-3">
                {skipsDistribution[subject.id]} skips
              </div>
            </div>
          </div>
        )}
        
        {/* Card Header */}
        <div className="p-5 cursor-pointer" onClick={() => flipCard(subject.id)}>
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full border ${getTypeColor(subject.type)}`}>
                    {subject.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full border ${getPriorityColor(subject.priority)}`}>
                    {subject.priority} Priority
                  </span>
                </div>
              </div>
            </div>
            
            <div 
              className={`w-8 h-8 ${isFlipped ? 'bg-indigo-100' : 'bg-gray-100'} rounded-full flex items-center justify-center transition-colors duration-200`}
            >
              {isFlipped ? 
                <ChevronUp className="w-5 h-5 text-indigo-600" /> : 
                <ChevronDown className="w-5 h-5 text-gray-500" />
              }
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-gradient-to-b from-indigo-50 to-indigo-100 p-3 rounded-lg">
              <div className="text-xs text-indigo-600 mb-1 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Attendance</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold text-gray-800">{subject.attendance.toFixed(1)}%</span>
                <span className={`ml-2 text-xs ${attendanceStatus.color}`}>{attendanceStatus.message}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-purple-50 to-purple-100 p-3 rounded-lg">
              <div className="text-xs text-purple-600 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Weekly Classes</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold text-gray-800">{subject.weeklyClasses}</span>
                <span className="ml-2 text-xs text-purple-600">Classes/week</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Details */}
        <AnimatePresence>
          {isFlipped && (
            <motion.div 
              className="border-t border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                {/* Priority Selection */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Set Priority Level
                  </label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map(p => (
                      <button
                        key={p}
                        onClick={() => changePriority(subject.id, p)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          subject.priority === p
                            ? `bg-gradient-to-r ${getPriorityGradient(p)} text-white shadow-md`
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Reasoning */}
                {reasoning && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Info className="w-4 h-4 text-indigo-500" />
                      Why This Skip Count?
                    </h4>
                    <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400"></div>
                      <p className="text-sm text-gray-600 pl-3">
                        {reasoning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SkipPlanner = () => {
  // Get data from attendance context
  const { subjects: contextSubjects, allowedSkips: contextAllowedSkips } = useAttendance();
  const navigate = useNavigate();
  
  // Fallback subjects in case no data from context
  const fallbackSubjects = [
    { id: 1, name: 'HS121', type: 'THEORY', attendance: 100, totalClasses: 30, weeklyClasses: 2, priority: 'Low' },
    { id: 2, name: 'IT259', type: 'THEORY', attendance: 80.49, totalClasses: 33, weeklyClasses: 3, priority: 'Medium' },
    { id: 3, name: 'IT258', type: 'LAB', attendance: 85.71, totalClasses: 25, weeklyClasses: 1, priority: 'High' },
    { id: 4, name: 'MA101', type: 'THEORY', attendance: 78.57, totalClasses: 28, weeklyClasses: 2, priority: 'Medium' },
    { id: 5, name: 'CS214', type: 'LAB', attendance: 90.32, totalClasses: 31, weeklyClasses: 1, priority: 'Low' },
  ];
  
  // Use context subjects if available, otherwise use fallback
  const [subjects, setSubjects] = useState([]);
  const [allowedSkips, setAllowedSkips] = useState(11);
  const [distributionStrategy, setDistributionStrategy] = useState('balanced');
  const [skipsDistribution, setSkipsDistribution] = useState({});
  const [reasonings, setReasonings] = useState({});
  const [summary, setSummary] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFlipped, setIsFlipped] = useState({});
  const [noDataError, setNoDataError] = useState(false);
  
  // Initialize with context data if available
  useEffect(() => {
    if (contextSubjects && contextSubjects.length > 0) {
      setSubjects(contextSubjects);
      setNoDataError(false);
    } else {
      setSubjects(fallbackSubjects);
      setNoDataError(true);
    }
    
    if (contextAllowedSkips > 0) {
      setAllowedSkips(contextAllowedSkips);
    }
  }, [contextSubjects, contextAllowedSkips]);
  
  const { planSkips, isPending, isError, error, data } = useSkipPlanner();
  
  const canvasRef = useRef(null);

  // Initialize flip state for each card
  useEffect(() => {
    const initialFlipState = {};
    subjects.forEach(subject => {
      initialFlipState[subject.id] = false;
    });
    setIsFlipped(initialFlipState);
  }, [subjects]);
  
  // Handle API response
  useEffect(() => {
    if (data?.success && data?.data) {
      const { skipDistribution, reasoning, summary } = data.data;
      
      setSkipsDistribution(skipDistribution);
      setReasonings(reasoning);
      setSummary(summary);
      setShowConfetti(true);
    }
  }, [data]);

  // Trigger confetti when distribution is calculated
  useEffect(() => {
    if (showConfetti) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const runConfetti = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#a855f7', '#ec4899'],
        });
        
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#a855f7', '#ec4899'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(runConfetti);
        }
      };
      
      runConfetti();
      setTimeout(() => setShowConfetti(false), duration);
    }
  }, [showConfetti]);

  const calculateSkipsDistribution = () => {
    // Format subjects data for the API
    const apiData = {
      subjects: subjects.map(subject => ({
        id: subject.id,
        name: subject.name,
        type: subject.type,
        attendance: subject.attendance,
        totalClasses: subject.totalClasses,
        weeklyClasses: subject.weeklyClasses,
        priority: subject.priority
      })),
      allowedSkips,
      distributionStrategy
    };
    
    // Call the API
    planSkips(apiData);
  };

  const flipCard = (subjectId) => {
    setIsFlipped(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  const getChartData = () => {
    return subjects.map(subject => ({
      name: subject.name,
      skips: skipsDistribution[subject.id] || 0,
      attendance: subject.attendance
    }));
  };

  const handleChangeSubjectPriority = (subjectId, priority) => {
    setSubjects(subjects.map(subject => 
      subject.id === subjectId ? { ...subject, priority } : subject
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        {noDataError && (
          <motion.div 
            className="max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Using Sample Data</h3>
                  <p className="text-amber-700 mb-4">
                    You haven't calculated your attendance yet. The planner is showing sample data.
                  </p>
                  <Button 
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
                    onClick={() => navigate('/calculator')}
                  >
                    <Calculator className="w-4 h-4" />
                    Calculate Your Attendance First
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 shadow-xl bg-white rounded-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                    1
                  </span>
                  Configure Your Plan
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
                    <Label htmlFor="allowed-skips" className="text-lg font-medium text-gray-800 block mb-3 flex justify-between">
                      <span>Allowed Bunks</span>
                      <span className="text-indigo-600 font-bold">{allowedSkips}</span>
                    </Label>
                    <Slider
                      id="allowed-skips"
                      min={0}
                      max={30}
                      step={1}
                      value={[allowedSkips]}
                      onValueChange={(value) => setAllowedSkips(value[0])}
                      className="mt-2"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>0</span>
                      <span>15</span>
                      <span>30</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
                    <Label htmlFor="distribution-strategy" className="text-lg font-medium text-gray-800 block mb-3">
                      Distribution Strategy
                    </Label>
                    <Select
                      value={distributionStrategy}
                      onValueChange={setDistributionStrategy}
                    >
                      <SelectTrigger id="distribution-strategy" className="bg-white border-gray-200 h-12 rounded-lg">
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="balanced" className="py-2 px-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                            <span>Balanced (Recommended)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="attendance" className="py-2 px-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span>Based on Attendance</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="priority" className="py-2 px-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Based on Subject Priority</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="classes" className="py-2 px-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span>Based on Weekly Classes</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 font-medium rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={calculateSkipsDistribution}
                    disabled={isPending}
                  >
                    {isPending ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Calculate Bunk Distribution
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  
                  {isError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">
                        {error?.message || 'An error occurred while calculating. Please try again.'}
                      </p>
                    </div>
                  )}
                  
                  {Object.keys(skipsDistribution).length > 0 && (
                    <div className="mt-6">
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                        <h3 className="font-medium text-indigo-800 mb-2">Distribution Summary</h3>
                        <p className="text-gray-700 text-sm">{summary}</p>
                      </div>
                      
                      <div className="mt-6 h-64 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip 
                              formatter={(value, name) => [value, name === 'skips' ? 'Skips' : 'Attendance %']}
                              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            />
                            <Bar dataKey="skips" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                            <defs>
                              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="space-y-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                  2
                </span>
                Your Subjects
              </h2>
              
              <div className="grid grid-cols-1 gap-5">
                {subjects.map(subject => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    isFlipped={isFlipped[subject.id]}
                    flipCard={flipCard}
                    priority={subject.priority}
                    skipsDistribution={skipsDistribution}
                    reasoning={reasonings[subject.id]}
                    changePriority={handleChangeSubjectPriority}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
      <canvas ref={canvasRef} className="fixed pointer-events-none inset-0 z-50 w-full h-full" />
    </div>
  );
};

export default SkipPlanner; 
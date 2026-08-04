import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  FileText,
  Briefcase,
  Users,
  Video,
  Play,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  User,
  MapPin,
  Clock,
  Calendar,
  Send,
  Plus,
  Trash2,
  X,
  PlusCircle,
  Sparkles
} from 'lucide-react';

interface StudentSubpagesProps {
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  profile: any;
  activeTab: string;
}

export const StudentDashboardSubpages: React.FC<StudentSubpagesProps> = ({
  addToast,
  profile,
  activeTab
}) => {
  // Course state
  const [courses, setCourses] = useState([
    {
      id: 'course-1',
      title: 'Reinforced Concrete Design (Eurocode 2)',
      category: 'Structural Engineering',
      progress: 60,
      instructor: 'Engr. Kola Adeyemi, FNSE',
      duration: '12 Hours',
      lessons: [
        { id: 'l1', title: 'Introduction to Limit State Design', completed: true },
        { id: 'l2', title: 'Flexural Analysis of Beams', completed: true },
        { id: 'l3', title: 'Shear and Torsional Resistance', completed: true },
        { id: 'l4', title: 'Serviceability Limit States (Deflection)', completed: false },
        { id: 'l5', title: 'Column Design and Slenderness Effects', completed: false }
      ]
    },
    {
      id: 'course-2',
      title: 'Structural Steel Detailing using Revit',
      category: 'BIM & Modelling',
      progress: 25,
      instructor: 'Arc. Amina Nwosu',
      duration: '8 Hours',
      lessons: [
        { id: 'l2-1', title: 'Revit Steel Connections Interface', completed: true },
        { id: 'l2-2', title: 'Modelling Column Bases and Gusset Plates', completed: false },
        { id: 'l2-3', title: 'Weld and Bolt Detailing Schedules', completed: false }
      ]
    },
    {
      id: 'course-3',
      title: 'Quantity Surveying & Bills of Engineering Measurement (BEM)',
      category: 'Cost Estimation',
      progress: 0,
      instructor: 'QS. Toyin Adebayo',
      duration: '10 Hours',
      lessons: [
        { id: 'l3-1', title: 'Introduction to CESMM4 Standards', completed: false },
        { id: 'l3-2', title: 'Take-off Quantities for Earthworks', completed: false },
        { id: 'l3-3', title: 'Drafting Bill of Quantities (BOQ)', completed: false }
      ]
    }
  ]);

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Mentorship state
  const [mentors, setMentors] = useState([
    { id: 'm1', name: 'Engr. Kola Adeyemi', specialty: 'Structural Engineering', rating: 4.9, location: 'Lagos', avatar: 'KA', slots: 3 },
    { id: 'm2', name: 'Arc. Amina Nwosu', specialty: 'Residential Architecture', rating: 4.8, location: 'Abuja', avatar: 'AN', slots: 2 },
    { id: 'm3', name: 'QS. Toyin Adebayo', specialty: 'Quantity Surveying', rating: 4.9, location: 'Lagos', avatar: 'TA', slots: 4 }
  ]);
  const [mentorshipRequests, setMentorshipRequests] = useState([
    { id: 'req-1', mentorName: 'Engr. Kola Adeyemi', specialty: 'Structural Engineering', status: 'Approved', date: '2026-06-15' }
  ]);
  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [mentorshipObjective, setMentorshipObjective] = useState('');

  // Scholarship state
  const [scholarships, setScholarships] = useState([
    { id: 's1', title: 'Julius Berger Excellence Grant 2026', provider: 'Julius Berger Nigeria Plc', amount: '₦500,000 / Year', deadline: 'July 25, 2026', desc: 'A premium grant awarded to outstanding top-tier civil engineering students.' },
    { id: 's2', title: 'Lagos State Civil Infrastructure Scholarship', provider: 'Lagos State Ministry of Works', amount: '₦350,000 / Year', deadline: 'August 10, 2026', desc: 'A state-funded scholarship focusing on urban planning and highway engineering graduates.' },
    { id: 's3', title: 'Chevron STEM Engineering Fund', provider: 'Chevron Nigeria Limited', amount: '₦600,000 / Year', deadline: 'September 15, 2026', desc: 'Annual fellowship targeting stellar female undergraduates in structural or mechanical engineering fields.' }
  ]);
  const [scholarshipApplications, setScholarshipApplications] = useState([
    { id: 'app-1', title: 'Julius Berger Excellence Grant 2026', status: 'Under Review', date: '2026-07-02' }
  ]);
  const [scholarshipModalOpen, setScholarshipModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [scholarshipForm, setScholarshipForm] = useState({ university: '', gpa: '', level: '400L', statement: '' });

  // Research hub state
  const [researchPapers, setResearchPapers] = useState([
    { id: 'p1', title: 'Eco-Concrete Design: Replacing Portland Cement with Pulverized Coconut Shell Ash', author: 'Josephine Sintei, University of Lagos', downloads: 142, date: '2026-05-12' },
    { id: 'p2', title: 'Seismic Vulnerability Assessment of Multistory Buildings in Coastal Cities of Nigeria', author: 'Engr. Alabi Hassan & Partners', downloads: 284, date: '2026-03-20' }
  ]);
  const [paperTitle, setPaperTitle] = useState('');
  const [paperAuthor, setPaperAuthor] = useState('');

  // Competitions state
  const [competitions, setCompetitions] = useState([
    { id: 'c1', title: 'Lagos Smart City Sustainable Housing Challenge 2026', prize: '₦2,500,000 + Internship', deadline: 'August 30, 2026', teamCount: 18, joined: false },
    { id: 'c2', title: 'National Bridge Design Modeling Hackathon', prize: '₦1,000,000 Cash Prize', deadline: 'October 15, 2026', teamCount: 8, joined: false }
  ]);

  // Career Center state
  const [internships, setInternships] = useState([
    { id: 'i1', title: 'Junior Assistant Resident Engineer', firm: 'Julius Berger Nigeria Plc', location: 'Lagos (Site-based)', duration: '6 Months', allowance: '₦80,000 / Month', applied: false },
    { id: 'i2', title: 'BIM/CAD Detailing Intern', firm: 'Adeyemi Engineering Consultants', location: 'Abuja (Hybrid)', duration: '3 Months', allowance: '₦50,000 / Month', applied: false },
    { id: 'i3', title: 'Structural Analyst Trainee', firm: 'StructureWorks Partners Ltd', location: 'Lagos (Remote)', duration: '6 Months', allowance: '₦60,000 / Month', applied: false }
  ]);
  const [appliedInternships, setAppliedInternships] = useState<{ [key: string]: string }>({});

  // AI Study Assistant state
  const [aiMessages, setAiMessages] = useState<Array<{ id: string; sender: 'student' | 'ai'; text: string; time: string }>>([
    { id: '1', sender: 'ai', text: 'Hello! I am your AI Engineering Study Assistant. Ask me anything about concrete Eurocodes (EC2), structural steel detailing, CESMM4 costing, or exam preparations!', time: 'Just now' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const [aiSelectedMode, setAiSelectedMode] = useState<'chat' | 'exam-prep'>('chat');
  const [aiExamType, setAiExamType] = useState<'COREN' | 'University finals' | 'Structural practice'>('COREN');
  const [examState, setExamState] = useState<{ currentQuestionIndex: number; score: number; questions: any[]; finished: boolean } | null>(null);

  // Past Questions state
  const [pastQuestionsFilter, setPastQuestionsFilter] = useState({ institution: 'University of Lagos', course: 'All', year: '2024', level: '400L' });
  const [selectedPastPaper, setSelectedPastPaper] = useState<any | null>(null);
  const [pastPaperPracticeState, setPastPaperPracticeState] = useState<{ currentIndex: number; answers: Record<number, string>; submitted: boolean } | null>(null);

  // CV Builder state
  const [cvData, setCvData] = useState({
    fullName: profile?.fullName || 'Josephine Sintei',
    email: profile?.email || 'josephine.sintei@unilag.edu.ng',
    phone: '+234 812 345 6789',
    university: 'University of Lagos (UNILAG)',
    cgpa: '4.62 / 5.00',
    experience: 'Academic Project Lead on eco-concrete mix design using agricultural waste.',
    skills: 'AutoCAD, BIM Modelling (Revit), Structural Analysis (Orion/Prota), Microsoft Office Suite',
    certifications: 'Nigerian Institution of Civil Engineers (NICE) Student Member'
  });

  // Library/Research Hub state
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategory, setLibraryCategory] = useState('All');
  const [savedLibraryIds, setSavedLibraryIds] = useState<string[]>([]);

  // Community state
  const [forumPosts, setForumPosts] = useState([
    { id: 'f1', title: 'Why is Eurocode 2 preferred over BS 8110 for new Lagos high-rise projects?', author: 'David Okafor', replies: 2, category: 'Structural', likes: 24 },
    { id: 'f2', title: 'Tips on calculating wind load on coastal steel warehouses?', author: 'Grace Ade', replies: 1, category: 'Steel Design', likes: 18 }
  ]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCat, setNewPostCat] = useState('Structural');

  const [threadComments, setThreadComments] = useState<Record<string, Array<{ id: string; author: string; role: string; content: string; date: string }>>>({
    'f1': [
      { id: 'c-1', author: 'Engr. Kola Adeyemi', role: 'Professional', content: 'Eurocode 2 provides a more consistent, probabilistic approach to safety and serviceability. BS 8110 is legacy now.', date: '3 hours ago' },
      { id: 'c-2', author: 'Josephine Sintei', role: 'Student', content: 'Makes sense! I am using EC2 for my civil engineering project mix design study.', date: '1 hour ago' }
    ],
    'f2': [
      { id: 'c-3', author: 'Amina Nwosu', role: 'Professional', content: 'Be sure to apply local wind speed coefficients for Lagos coastal regions. It can be high near Lekki/Victoria Island.', date: 'Yesterday' }
    ]
  });
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = (e: React.FormEvent, threadId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: profile?.fullName || 'Josephine Sintei',
      role: 'Student',
      content: commentText,
      date: 'Just now'
    };
    setThreadComments(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newComment]
    }));
    setForumPosts(prev => prev.map(p => p.id === threadId ? { ...p, replies: p.replies + 1 } : p));
    setCommentText('');
    addToast('success', 'Comment Posted', 'Your reply has been published to the student forum thread.');
  };

  // Interactive Quiz handler
  const handleLessonCheck = (courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updatedLessons = c.lessons.map(l => {
          if (l.id === lessonId) return { ...l, completed: !l.completed };
          return l;
        });
        const completedCount = updatedLessons.filter(l => l.completed).length;
        const progress = Math.round((completedCount / updatedLessons.length) * 100);
        return { ...c, lessons: updatedLessons, progress };
      }
      return c;
    }));
    addToast('success', 'Lesson State Updated', 'Course syllabus progress recalculated successfully.');
  };

  const handleQuizSubmit = (answer: string) => {
    setQuizAnswer(answer);
    setQuizSubmitted(true);
    if (answer === 'B') {
      addToast('success', 'Correct Answer!', 'Fantastic! Eurocode 2 requires a minimum nominal cover of 20mm for interior exposure (Class XC1).');
      // Advance course 1 progress slightly
      setCourses(prev => prev.map(c => {
        if (c.id === 'course-1') {
          return { ...c, progress: Math.min(100, c.progress + 10) };
        }
        return c;
      }));
    } else {
      addToast('warning', 'Incorrect Answer', 'Not quite. Check your structural slab cover formulas under Eurocode Class XC1 rules and try again.');
    }
  };

  // Mentorship apply handler
  const handleRequestMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorshipObjective.trim()) {
      addToast('error', 'Incomplete Request', 'Please supply your career or study mentoring objective.');
      return;
    }
    const newReq = {
      id: `req-${Date.now()}`,
      mentorName: selectedMentor.name,
      specialty: selectedMentor.specialty,
      status: 'Pending Verification',
      date: new Date().toISOString().split('T')[0]
    };
    setMentorshipRequests([newReq, ...mentorshipRequests]);
    setMentorModalOpen(false);
    setMentorshipObjective('');
    addToast('success', 'Mentorship Solicited', `Your mentoring proposal has been dispatched to ${selectedMentor.name}.`);
  };

  // Scholarship apply handler
  const handleApplyScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarshipForm.university || !scholarshipForm.gpa || !scholarshipForm.statement) {
      addToast('error', 'Form Incomplete', 'Please fill in all details for your scholarship petition.');
      return;
    }
    const newApp = {
      id: `app-${Date.now()}`,
      title: selectedScholarship.title,
      status: 'Applied (Under Review)',
      date: new Date().toISOString().split('T')[0]
    };
    setScholarshipApplications([newApp, ...scholarshipApplications]);
    setScholarshipModalOpen(false);
    setScholarshipForm({ university: '', gpa: '', level: '400L', statement: '' });
    addToast('success', 'Petition Received', `Scholarship application for "${selectedScholarship.title}" submitted successfully.`);
  };

  // Upload Research Paper
  const handleUploadPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperTitle.trim() || !paperAuthor.trim()) {
      addToast('error', 'Missing Data', 'Please supply both paper title and author name.');
      return;
    }
    const newPaper = {
      id: `p-${Date.now()}`,
      title: paperTitle,
      author: paperAuthor,
      downloads: 0,
      date: new Date().toISOString().split('T')[0]
    };
    setResearchPapers([newPaper, ...researchPapers]);
    setPaperTitle('');
    setPaperAuthor('');
    addToast('success', 'Publication Uplinked', 'Your research thesis has been cataloged in the academic hub.');
  };

  // Add forum post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;
    const newPost = {
      id: `f-${Date.now()}`,
      title: newPostTitle,
      author: profile?.fullName || 'Sintei Josephine',
      replies: 0,
      category: newPostCat,
      likes: 1
    };
    setForumPosts([newPost, ...forumPosts]);
    setNewPostTitle('');
    addToast('success', 'Forum Thread Open', 'Your discussion query has been posted to the Student Guild.');
  };

  const handleApplyInternship = (id: string, title: string, firm: string) => {
    setAppliedInternships(prev => ({ ...prev, [id]: 'Applied' }));
    addToast('success', 'Application Transmitted', `Your professional profile and transcript were dispatched to ${firm} for the ${title} post.`);
  };

  // AI Study Assistant handlers
  const handleSendAiMessage = (forcedText?: string) => {
    const textToSend = forcedText || aiInput;
    if (!textToSend.trim()) return;

    const studentMsg = { id: `m-${Date.now()}`, sender: 'student' as const, text: textToSend, time: 'Just now' };
    setAiMessages(prev => [...prev, studentMsg]);
    if (!forcedText) setAiInput('');

    setAiIsTyping(true);
    setTimeout(() => {
      let replyText = "That's an interesting engineering query! Let me break that down for you under Nigerian building conditions:\n\n";
      const queryLower = textToSend.toLowerCase();

      if (queryLower.includes('eurocode') || queryLower.includes('ec2') || queryLower.includes('concrete')) {
        replyText += "**Eurocode 2 Concrete Design Rules (Slabs & Beams):**\n" +
          "1. **Concrete Cover (XC1 environment)**: Minimum nominal cover $c_{nom} = c_{min} + \\Delta c_{dev}$ where $c_{min} = 15\\text{ mm}$ and $\\Delta c_{dev} = 5-10\\text{ mm}$ (typically $20\\text{ mm}$ for slabs).\n" +
          "2. **Bending Formula**: Ultimate limit state moment resistance is calculated using the rectangular stress block:\n" +
          "   $$M_{Rd} = 0.167 f_{ck} b d^2$$ (for balanced reinforced sections).\n" +
          "3. **Shear reinforcement**: Slabs usually do not require shear stirrups if $V_{Ed} \\le V_{Rd,c}$.";
      } else if (queryLower.includes('cost') || queryLower.includes('measurement') || queryLower.includes('boq') || queryLower.includes('cesmm')) {
        replyText += "**CESMM4 Standards & BOQ Estimation:**\n" +
          "- **Class A**: General Items (insurance, supervisor mobilization, site offices).\n" +
          "- **Class B**: Ground investigation and soil testing.\n" +
          "- **Class D**: Demolition and site clearance measured in square meters ($m^2$) or as a lump sum.\n" +
          "- **Class G**: Concrete works split strictly by strength grade (e.g. C20/25, C30/37) and thickness ranges.";
      } else if (queryLower.includes('steel') || queryLower.includes('detailing') || queryLower.includes('revit')) {
        replyText += "**Structural Steel Connection Detailing rules:**\n" +
          "1. **Bolt spacing**: Minimum spacing between centers of bolts is $2.5 d$ where $d$ is the bolt diameter.\n" +
          "2. **Edge distance**: Minimum edge distance from bolt center to member boundary is $1.2 d_0$ ($d_0$ = hole size).\n" +
          "3. **Gusset plates**: Tension joints require shear resistance check across both net section and gross section yielding thresholds.";
      } else {
        replyText += "Based on standard professional engineering design guidelines in Nigeria:\n\n" +
          "1. Ensure you cross-reference the *National Building Code (2006)* alongside modern BS EN standards.\n" +
          "2. Always compute live loading parameters based on BS EN 1991 (Eurocode 1) for coastal environments.\n" +
          "3. If designing foundations in Lekki/VI sands, utilize soil bearing pressure thresholds verified via triple-cone penetrometer testing ($P_{allow} \\approx 50-75\\text{ kN/m}^2$).";
      }

      const aiMsg = { id: `m-${Date.now() + 1}`, sender: 'ai' as const, text: replyText, time: 'Just now' };
      setAiMessages(prev => [...prev, aiMsg]);
      setAiIsTyping(false);
      addToast('success', 'AI Tutor Replied', 'New helpful response generated.');
    }, 1200);
  };

  const handleStartExamPrep = () => {
    let qs: any[] = [];
    if (aiExamType === 'COREN') {
      qs = [
        { q: 'Which body is legally empowered to register and regulate engineering professionals in Nigeria?', options: ['NSE', 'COREN', 'NICE', 'ACEN'], ans: 'B', explanation: 'COREN (Council for the Regulation of Engineering in Nigeria) is the statutory regulatory body established by decree.' },
        { q: 'What is the standard penalty for practicing engineering in Nigeria without a COREN license?', options: ['A small fine only', 'Imprisonment and/or heavy fines under statutory acts', 'Simple reprimand', 'Suspension of university degree'], ans: 'B', explanation: 'Practice without registration constitutes a criminal offense under the Amendment Act.' },
        { q: 'Under COREN rules, who is responsible for endorsing structural drawings for final building permit approval?', options: ['Registered Engineer', 'Registered Technologist', 'Ecosystem Craftsman', 'Site Supervisor'], ans: 'A', explanation: 'Only a registered professional Engineer (R.Eng) with seal can endorse structural calculations/drawings.' }
      ];
    } else if (aiExamType === 'University finals') {
      qs = [
        { q: 'What limit state addresses the crack widths and deflection limits of a structure?', options: ['Ultimate Limit State', 'Serviceability Limit State', 'Seismic Limit State', 'Plastic Collapse Limit State'], ans: 'B', explanation: 'Serviceability Limit State (SLS) ensures user comfort, aesthetic preservation, and durability through crack and deflection limits.' },
        { q: 'In soil mechanics, what does a high plasticity index usually indicate about clay soils?', options: ['Low settlement risk', 'High swell and shrinkage potential', 'Excellent foundation material', 'Highly permeable drainage'], ans: 'B', explanation: 'High plasticity clay (like Lekki black cotton soils) exhibits substantial swelling and moisture sensitivity.' }
      ];
    } else {
      qs = [
        { q: 'What is the characteristic yield strength of Grade 500 high-yield reinforcing steel?', options: ['250 N/mm²', '460 N/mm²', '500 N/mm²', '600 N/mm²'], ans: 'C', explanation: 'Grade 500 steel represents a specified characteristic yield strength of 500 MPa (N/mm²).' }
      ];
    }

    setExamState({
      currentQuestionIndex: 0,
      score: 0,
      questions: qs,
      finished: false
    });
    addToast('info', 'Exam Mode Activated', 'Answer the generated mock test questions to test your skills.');
  };

  const handleSelectExamAnswer = (ans: string) => {
    if (!examState) return;
    const currentQ = examState.questions[examState.currentQuestionIndex];
    const isCorrect = ans === currentQ.ans;
    const newScore = isCorrect ? examState.score + 1 : examState.score;

    if (isCorrect) {
      addToast('success', 'Correct!', currentQ.explanation);
    } else {
      addToast('error', 'Wrong Answer', `Incorrect. Correct answer was ${currentQ.ans}. ${currentQ.explanation}`);
    }

    setTimeout(() => {
      const nextIndex = examState.currentQuestionIndex + 1;
      if (nextIndex >= examState.questions.length) {
        setExamState(prev => prev ? { ...prev, score: newScore, finished: true } : null);
        addToast('info', 'Mock Exam Complete', `You scored ${newScore}/${examState.questions.length}!`);
      } else {
        setExamState(prev => prev ? { ...prev, score: newScore, currentQuestionIndex: nextIndex } : null);
      }
    }, 1500);
  };

  // Past Questions practice handlers
  const handleSelectPastPaper = (paper: any) => {
    setSelectedPastPaper(paper);
    setPastPaperPracticeState({
      currentIndex: 0,
      answers: {},
      submitted: false
    });
    addToast('info', 'Loaded Test Paper', `You are now sitting for ${paper.title}`);
  };

  const handleSelectPastPaperAnswer = (qIndex: number, ans: string) => {
    if (!pastPaperPracticeState) return;
    setPastPaperPracticeState({
      ...pastPaperPracticeState,
      answers: {
        ...pastPaperPracticeState.answers,
        [qIndex]: ans
      }
    });
  };

  const handleSubmitPastPaperPractice = () => {
    if (!pastPaperPracticeState || !selectedPastPaper) return;
    setPastPaperPracticeState({
      ...pastPaperPracticeState,
      submitted: true
    });
    // Calculate score
    let score = 0;
    selectedPastPaper.questions.forEach((q: any, idx: number) => {
      if (pastPaperPracticeState.answers[idx] === q.ans) {
        score++;
      }
    });
    addToast('success', 'Practice Graded', `You answered ${score} out of ${selectedPastPaper.questions.length} questions correctly.`);
  };

  const handleSaveCV = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'CV Saved', 'Your Academic Profile & CV variables were successfully committed to local disk.');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Dynamic Subpage Header */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl flex justify-between items-center">
        <div>
          <span className="text-[10px] font-black uppercase text-[#1A56A0] tracking-wider">Student Academy Portal</span>
          <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mt-0.5">{activeTab} Workspace</h1>
        </div>
        <div className="h-10 w-10 bg-blue-50 dark:bg-slate-700/60 text-[#1A56A0] dark:text-blue-400 rounded-xl flex items-center justify-center">
          <BookOpen className="h-5 w-5" />
        </div>
      </div>

      {/* ==========================================
          SUBPAGE: MY COURSES
         ========================================== */}
      {activeTab === 'My Courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Enrolled Academic Modules</h3>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 border border-gray-100 dark:border-slate-700 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-slate-700/20 transition-all">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-[#1A56A0]/10 text-[#1A56A0] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">{course.category}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{course.duration}</span>
                      </div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide truncate">{course.title}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold">Syllabus Instructor: {course.instructor}</p>
                    </div>
                    <div className="w-full md:w-48 flex items-center gap-3.5">
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                          <span>Syllabus Completion</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1A56A0] rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveCourseId(course.id);
                          setActiveLessonId(course.lessons[0]?.id || null);
                          setQuizSubmitted(false);
                          setQuizAnswer(null);
                        }}
                        className="px-4 py-2 bg-slate-50 hover:bg-[#1A56A0] dark:bg-slate-700 hover:text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex-shrink-0"
                      >
                        {course.progress === 0 ? 'Start' : course.progress === 100 ? 'Review' : 'Resume'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Class Simulator */}
            {activeCourseId && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                {(() => {
                  const course = courses.find(c => c.id === activeCourseId)!;
                  return (
                    <>
                      <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Learning Deck</p>
                          <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase mt-0.5">{course.title}</h4>
                        </div>
                        <button onClick={() => setActiveCourseId(null)} className="text-gray-400 hover:text-gray-600">
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Mock Video Stream */}
                      <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center text-white border border-slate-800">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950 opacity-90" />
                        <div className="relative z-10 text-center space-y-3 p-4">
                          <div className="h-14 w-14 bg-[#1A56A0]/80 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                            <Video className="h-6 w-6 text-white ml-0.5" />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-blue-400">Classroom Lecture Stream</p>
                            <p className="text-[11px] text-gray-400 font-medium mt-1">Video lesson with interactive slide attachments</p>
                          </div>
                          <span className="inline-block text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                            Live Stream Sync Active
                          </span>
                        </div>
                      </div>

                      {/* Interactive Syllabus Checklist */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Course Curriculum Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {course.lessons.map(lesson => (
                            <div key={lesson.id} className="p-3 border border-gray-50 dark:border-slate-700/50 rounded-xl flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 pr-2 truncate">{lesson.title}</span>
                              <input
                                type="checkbox"
                                checked={lesson.completed}
                                onChange={() => handleLessonCheck(course.id, lesson.id)}
                                className="h-4 w-4 rounded text-[#1A56A0] focus:ring-[#1A56A0] cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lecture Interactive Test */}
                      {course.id === 'course-1' && (
                        <div className="bg-blue-50/50 dark:bg-slate-900/40 border border-blue-100 dark:border-slate-700 p-5 rounded-2xl space-y-4">
                          <div className="flex items-start gap-3">
                            <HelpCircle className="h-5 w-5 text-[#1A56A0] flex-shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Lecture Interactive Checkpoint</h5>
                              <p className="text-[11px] text-gray-500 mt-0.5">Answer correctly to unlock an immediate +10% syllabus completion bonus.</p>
                            </div>
                          </div>

                          <div className="space-y-2.5 text-xs text-left">
                            <p className="font-extrabold text-gray-800 dark:text-gray-200">
                              "Under Eurocode 2 (Class XC1 interior exposure), what is the minimum nominal concrete cover required for durability specification of concrete slabs?"
                            </p>
                            
                            <div className="space-y-2">
                              {[
                                { key: 'A', text: '15 mm nominal cover' },
                                { key: 'B', text: '20 mm nominal cover' },
                                { key: 'C', text: '35 mm nominal cover' }
                              ].map(opt => (
                                <button
                                  key={opt.key}
                                  disabled={quizSubmitted}
                                  onClick={() => handleQuizSubmit(opt.key)}
                                  className={`w-full p-3 border rounded-xl flex items-center justify-between text-left transition-all ${
                                    quizSubmitted
                                      ? opt.key === 'B'
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/20'
                                        : quizAnswer === opt.key
                                          ? 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/20'
                                          : 'border-gray-100 opacity-60'
                                      : 'border-gray-200 hover:border-blue-400 hover:bg-white cursor-pointer'
                                  }`}
                                >
                                  <span><span className="font-black mr-2">{opt.key}.</span> {opt.text}</span>
                                  {quizSubmitted && opt.key === 'B' && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Study Achievements</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl flex items-center justify-center font-black text-xs uppercase">★</div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-900 dark:text-white">Concrete Master Badge</p>
                    <p className="text-[10px] text-gray-400 font-semibold">Earned after finishing reinforced slab modules</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="h-9 w-9 bg-slate-50 dark:bg-slate-700 text-gray-400 rounded-xl flex items-center justify-center font-black text-xs uppercase">🔒</div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-900 dark:text-white">Steel Detailing Specialist</p>
                    <p className="text-[10px] text-gray-400 font-semibold">Complete Revit course to unlock certification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: MENTORSHIP
         ========================================== */}
      {activeTab === 'Mentorship' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* List Mentorship requests */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">My Mentoring Support</h3>
              {mentorshipRequests.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">No current mentoring partnerships. Request slot from experts below.</p>
              ) : (
                <div className="space-y-3">
                  {mentorshipRequests.map(req => (
                    <div key={req.id} className="p-4 border border-gray-50 dark:border-slate-700 rounded-xl flex items-center justify-between text-left">
                      <div>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">{req.mentorName}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Specialty Track: {req.specialty} | Initiated: {req.date}</p>
                      </div>
                      <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                        req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* List of mentors */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Ecosystem Verified Mentors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mentors.map(mentor => (
                  <div key={mentor.id} className="p-4 border border-gray-100 dark:border-slate-700 rounded-2xl flex flex-col justify-between text-left hover:shadow-sm transition-shadow">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 bg-[#1A56A0]/10 text-[#1A56A0] rounded-xl flex items-center justify-center font-black text-xs">
                          {mentor.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 dark:text-white">{mentor.name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{mentor.specialty}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-[10px] font-bold text-gray-400">
                        <p>Location: {mentor.location}</p>
                        <p>Rating: ★ {mentor.rating}</p>
                        <p>Slots Open: <span className="text-emerald-600">{mentor.slots} slots</span></p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setMentorModalOpen(true);
                      }}
                      className="w-full mt-4 py-2 bg-slate-50 hover:bg-[#1A56A0] hover:text-white text-[#1A56A0] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Solicit Mentor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Request Info card */}
          <div className="space-y-6">
            <div className="bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 p-5 rounded-2xl text-xs space-y-3">
              <h4 className="font-black text-blue-900 dark:text-sky-400 uppercase tracking-wider">How Mentorship Works</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Platform mentors are vetted senior civil/structural engineers, registered architects, and quantity surveyors with at least 8 years of local experience.
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-gray-500">
                <li>Submit clear structural learning objectives</li>
                <li>Request reviews for drawing assignments</li>
                <li>Connect to internships through mentor referrals</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MENTOR MODAL */}
      {mentorModalOpen && selectedMentor && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleRequestMentorship} className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-gray-100 shadow-xl overflow-hidden text-left">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-black tracking-wider text-[#1A56A0]">Mentorship Solicitation</span>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase">Request {selectedMentor.name}</h3>
              </div>
              <button type="button" onClick={() => setMentorModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Study Specialty & Track</label>
                <input type="text" readOnly value={selectedMentor.specialty} className="w-full px-3 py-2 border border-gray-100 bg-gray-50 rounded-xl text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Your Career / Mentoring Objective</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain what specific topics (e.g. Eurocode beams, Revit connections) you wish to study and how often you seek reviews..."
                  value={mentorshipObjective}
                  onChange={(e) => setMentorshipObjective(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#1A56A0]"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-50 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setMentorModalOpen(false)} className="px-4 py-2 text-xs font-black uppercase text-gray-400 hover:text-gray-600">
                Abort
              </button>
              <button type="submit" className="px-5 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow">
                Transmit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: ENGINEERING LIBRARY
         ========================================== */}
      {activeTab === 'Engineering Library' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Category filters */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search building codes, structural text books, calculations templates..."
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <select
                  value={libraryCategory}
                  onChange={(e) => setLibraryCategory(e.target.value)}
                  className="px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  <option value="All">All Categories</option>
                  <option value="Building Codes">Building Codes</option>
                  <option value="Structural Codes">Structural Codes</option>
                  <option value="Research Papers">Research Papers</option>
                  <option value="AutoCAD Templates">Templates & Excel</option>
                </select>
              </div>

              {/* Verified Documents Catalog */}
              <div className="space-y-3.5">
                {[
                  { id: 'lib-1', title: 'Nigerian National Building Code (2006)', category: 'Building Codes', author: 'Federal Republic of Nigeria', size: '14.2 MB', downloads: 1240 },
                  { id: 'lib-2', title: 'BS EN 1992-1-1: Eurocode 2 (Design of Concrete Structures)', category: 'Structural Codes', author: 'CEN Standards Group', size: '8.4 MB', downloads: 3510 },
                  { id: 'lib-3', title: 'Excel Slab Design Calculator (EC2 Compliant)', category: 'AutoCAD Templates', author: 'Ecosystem Engineering Group', size: '1.2 MB', downloads: 950 },
                  { id: 'lib-4', title: 'Standard RC Beams AutoCAD Template (.dwg)', category: 'AutoCAD Templates', author: 'Engr. Kola Adeyemi', size: '4.7 MB', downloads: 620 },
                  { id: 'lib-5', title: 'Replacing Portland Cement with Coconut Shell Ash', category: 'Research Papers', author: 'Josephine Sintei, UNILAG', size: '3.1 MB', downloads: 142 }
                ]
                  .filter(doc => libraryCategory === 'All' || doc.category === libraryCategory)
                  .filter(doc => doc.title.toLowerCase().includes(librarySearch.toLowerCase()) || doc.author.toLowerCase().includes(librarySearch.toLowerCase()))
                  .map(doc => {
                    const isSaved = savedLibraryIds.includes(doc.id);
                    return (
                      <div key={doc.id} className="p-4 border border-gray-50 dark:border-slate-700/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:bg-gray-50/40 transition-all">
                        <div className="space-y-1">
                          <span className="text-[9px] bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-black px-2 py-0.5 rounded uppercase tracking-wider">{doc.category}</span>
                          <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide mt-1">{doc.title}</h4>
                          <p className="text-[10px] text-gray-400 font-semibold">Publisher: {doc.author} &bull; File Size: {doc.size}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => {
                              if (isSaved) {
                                setSavedLibraryIds(prev => prev.filter(id => id !== doc.id));
                                addToast('info', 'Removed from Library', 'Item removed from your personal dashboard locker.');
                              } else {
                                setSavedLibraryIds(prev => [...prev, doc.id]);
                                addToast('success', 'Saved to Library', 'Item locked in your personal dashboard library for quick access.');
                              }
                            }}
                            className={`px-3 py-2 text-[10px] font-black uppercase rounded-xl border ${
                              isSaved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-gray-600 border-gray-100'
                            }`}
                          >
                            {isSaved ? '✓ Saved' : 'Save'}
                          </button>
                          <button
                            onClick={() => addToast('success', 'Download Started', `Downloading ${doc.title} (${doc.size})`)}
                            className="px-3.5 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-blue-700"
                          >
                            Download ({doc.downloads})
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Upload paper */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Submit Your Thesis or AutoCAD Templates</h3>
              <form onSubmit={handleUploadPaper} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Document Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Concrete mix replacement study..."
                      value={paperTitle}
                      onChange={(e) => setPaperTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Author Affiliation / Institute</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Josephine Sintei, UNILAG"
                      value={paperAuthor}
                      onChange={(e) => setPaperAuthor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>
                <div className="border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:border-[#1A56A0]/40 transition-colors">
                  <p className="text-xs font-black uppercase text-[#1A56A0]">Drag and drop manuscript PDF, Excel sheets, or DWG</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">Maximum size 15MB. Must comply with academic peer-review standards.</p>
                </div>
                <button type="submit" className="px-6 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow">
                  Uplink Document
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3">My Library Locker</h4>
              {savedLibraryIds.length === 0 ? (
                <p className="text-[11px] text-gray-400 italic">No saved books, templates or blueprints in your locker yet.</p>
              ) : (
                <div className="space-y-2 text-xs">
                  {savedLibraryIds.map(id => {
                    return (
                      <div key={id} className="p-2.5 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-left">
                        <span className="font-extrabold text-gray-800 dark:text-gray-200 truncate pr-2">Locker item: {id}</span>
                        <button
                          onClick={() => setSavedLibraryIds(prev => prev.filter(savedId => savedId !== id))}
                          className="text-rose-500 hover:text-rose-700 text-[10px] uppercase font-black shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: AI STUDY ASSISTANT
         ========================================== */}
      {activeTab === 'AI Study Assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-4 shadow-sm h-fit space-y-5">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1">Tutor Workspace</h3>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setAiSelectedMode('chat')}
                className={`w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl border transition-all ${
                  aiSelectedMode === 'chat' ? 'bg-[#1A56A0] text-white border-[#1A56A0]' : 'bg-slate-50 text-gray-600 border-gray-100'
                }`}
              >
                AI Study Chat
              </button>
              <button
                onClick={() => {
                  setAiSelectedMode('exam-prep');
                  setExamState(null);
                }}
                className={`w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl border transition-all ${
                  aiSelectedMode === 'exam-prep' ? 'bg-[#1A56A0] text-white border-[#1A56A0]' : 'bg-slate-50 text-gray-600 border-gray-100'
                }`}
              >
                Exam Prep Mode
              </button>
            </div>

            {aiSelectedMode === 'exam-prep' && (
              <div className="space-y-4 pt-2 border-t border-gray-50">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Exam Syllabus</label>
                <select
                  value={aiExamType}
                  onChange={(e) => setAiExamType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold"
                >
                  <option value="COREN">COREN R.Eng Exam</option>
                  <option value="University finals">University Finals Prep</option>
                  <option value="Structural practice">Structural Design Practice</option>
                </select>
                <button
                  onClick={handleStartExamPrep}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow"
                >
                  Generate Mock Exam
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-6">
            {aiSelectedMode === 'chat' ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">AI Study Assistant Channel</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Powered by platform engineering database guidelines</p>
                    </div>
                  </div>

                  {/* Messages logs */}
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {aiMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed text-left shadow-sm ${
                          msg.sender === 'student'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-200'
                        }`}>
                          <div className="text-[9px] font-black opacity-60 mb-1">
                            {msg.sender === 'student' ? 'STUDENT' : 'AI TUTOR'} &bull; {msg.time}
                          </div>
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {aiIsTyping && (
                      <div className="flex justify-start">
                        <div className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-400 italic">
                          AI Tutor is breaking down formulas...
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message controls */}
                <div className="mt-6 space-y-3 border-t border-gray-50 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleSendAiMessage('What is the minimum concrete cover in Eurocode 2 for XC1 class?')}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-[#1A56A0] text-[10px] font-black uppercase rounded border border-gray-100 cursor-pointer"
                    >
                      Concrete Cover?
                    </button>
                    <button
                      onClick={() => handleSendAiMessage('Explain standard bolt spacing under structural steel design codes.')}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-[#1A56A0] text-[10px] font-black uppercase rounded border border-gray-100 cursor-pointer"
                    >
                      Steel bolt spacing?
                    </button>
                    <button
                      onClick={() => handleSendAiMessage('How is concrete classified under CESMM4 BOQ measurement guidelines?')}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-[#1A56A0] text-[10px] font-black uppercase rounded border border-gray-100 cursor-pointer"
                    >
                      CESMM4 concrete classes?
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask your engineering study question..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendAiMessage();
                      }}
                      className="flex-grow px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleSendAiMessage()}
                      className="px-5 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase"
                    >
                      Ask Tutor
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm min-h-[500px] text-left flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Interactive AI Mock Prep: {aiExamType}</h4>
                  
                  {!examState ? (
                    <div className="p-8 text-center space-y-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <HelpCircle className="h-10 w-10 text-gray-400 mx-auto" />
                      <p className="text-xs font-black uppercase text-gray-700">No active exam session.</p>
                      <p className="text-[11px] text-gray-400">Configure parameters on the left and tap "Generate Mock Exam" to practice.</p>
                    </div>
                  ) : examState.finished ? (
                    <div className="p-6 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <Award className="h-12 w-12 text-emerald-600 mx-auto" />
                      <div>
                        <h5 className="text-xs font-black uppercase text-emerald-800">Mock Exam Complete!</h5>
                        <p className="text-xs text-emerald-700 mt-1 font-bold">Your final score: {examState.score} / {examState.questions.length}</p>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed max-w-sm mx-auto">
                        This score demonstrates professional proficiency in technical topics. Check explanations below or start a new syllabus exam.
                      </p>
                      <button
                        onClick={() => setExamState(null)}
                        className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-black uppercase rounded-xl"
                      >
                        Acknowledge Results
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
                        <span>Question {examState.currentQuestionIndex + 1} of {examState.questions.length}</span>
                        <span>Score: {examState.score}</span>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-gray-100">
                        <p className="text-xs font-extrabold text-gray-900">{examState.questions[examState.currentQuestionIndex].q}</p>
                      </div>

                      <div className="space-y-2">
                        {examState.questions[examState.currentQuestionIndex].options.map((opt: string) => {
                          const isA = opt.startsWith('A') || opt === 'COREN' || opt === 'Ultimate Limit State' || opt === '250 N/mm²'; // fallback indexing simplified
                          const keyLetter = opt === 'COREN' || opt === 'High swell and shrinkage potential' || opt === 'Imprisonment and/or heavy fines under statutory acts' || opt === 'Serviceability Limit State' ? 'B' : opt === 'Registered Engineer' ? 'A' : 'C'; // mock keys
                          const actualLetter = opt === 'COREN' ? 'B' : opt === 'NSE' ? 'A' : opt === 'NICE' ? 'C' : opt === 'ACEN' ? 'D' : opt.includes('Imprisonment') ? 'B' : opt.includes('fine') ? 'A' : opt.includes('reprimand') ? 'C' : opt.includes('degree') ? 'D' : opt.includes('Registered Engineer') ? 'A' : opt.includes('Technologist') ? 'B' : opt.includes('Craftsman') ? 'C' : opt.includes('Supervisor') ? 'D' : opt.includes('Ultimate') ? 'A' : opt.includes('Serviceability') ? 'B' : opt.includes('Seismic') ? 'C' : opt.includes('Plastic') ? 'D' : opt.includes('settlement') ? 'A' : opt.includes('swell') ? 'B' : opt.includes('foundation') ? 'C' : opt.includes('permeable') ? 'D' : opt.includes('250') ? 'A' : opt.includes('460') ? 'B' : opt.includes('500') ? 'C' : 'D';
                          
                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectExamAnswer(actualLetter)}
                              className="w-full p-3 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-400 rounded-xl text-left text-xs font-extrabold flex items-center gap-3 cursor-pointer transition-colors"
                            >
                              <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-[10px] shrink-0">{actualLetter}</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: PAST QUESTIONS
         ========================================== */}
      {activeTab === 'Past Questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!selectedPastPaper ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Past Questions Directory</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Institution</label>
                    <select
                      value={pastQuestionsFilter.institution}
                      onChange={(e) => setPastQuestionsFilter({ ...pastQuestionsFilter, institution: e.target.value })}
                      className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold"
                    >
                      <option value="University of Lagos">University of Lagos</option>
                      <option value="Ahmadu Bello University">Ahmadu Bello University</option>
                      <option value="FUTA">FUTA Akure</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Academic Level</label>
                    <select
                      value={pastQuestionsFilter.level}
                      onChange={(e) => setPastQuestionsFilter({ ...pastQuestionsFilter, level: e.target.value })}
                      className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold"
                    >
                      <option value="400L">400 Level</option>
                      <option value="500L">500 Level (Finals)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { id: 'p-1', title: 'CVE 401: Structural Analysis III', level: '400L', institution: 'University of Lagos', year: '2023', questionsCount: 2, questions: [
                      { q: 'What is the degree of kinematic indeterminacy of a fixed-ended beam under vertical loads?', options: ['0', '1', '2', '3'], ans: 'A', explanation: 'A fixed beam has completely constrained rotations/displacements at supports.' },
                      { q: 'Which method is classified as a Force Method of structural analysis?', options: ['Moment Distribution Method', 'Slope Deflection Method', 'Method of Consistent Deformations', 'Stiffness Matrix Method'], ans: 'C', explanation: 'Method of Consistent Deformations represents the classical redundant force methodology.' }
                    ]},
                    { id: 'p-2', title: 'CVE 405: Reinforced Concrete Design I', level: '400L', institution: 'University of Lagos', year: '2024', questionsCount: 1, questions: [
                      { q: 'In limit state design of concrete, what is the partial safety factor for concrete strength under Eurocode 2?', options: ['1.0', '1.15', '1.4', '1.5'], ans: 'D', explanation: 'Eurocode 2 defines partial safety factor for concrete as 1.5.' }
                    ]}
                  ]
                    .filter(paper => paper.institution === pastQuestionsFilter.institution && paper.level === pastQuestionsFilter.level)
                    .map(paper => (
                      <div key={paper.id} className="p-4 border border-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-50/50 text-left">
                        <div>
                          <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black uppercase">{paper.year} Paper</span>
                          <h4 className="text-xs font-black text-gray-900 mt-1 uppercase">{paper.title}</h4>
                          <p className="text-[10px] text-gray-400 font-semibold">{paper.questionsCount} practice questions available</p>
                        </div>
                        <button
                          onClick={() => handleSelectPastPaper(paper)}
                          className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-blue-700"
                        >
                          Practice Test
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm text-left space-y-6">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase">Exam Simulator Active</span>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">{selectedPastPaper.title}</h4>
                  </div>
                  <button onClick={() => setSelectedPastPaper(null)} className="text-xs text-gray-400 hover:text-gray-600 font-bold uppercase">
                    Exit Practice
                  </button>
                </div>

                {pastPaperPracticeState && (
                  <div className="space-y-6">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                      <span>Question {pastPaperPracticeState.currentIndex + 1} of {selectedPastPaper.questions.length}</span>
                      <span>Practice Exam Timer: 45:00</span>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs font-extrabold text-gray-800">{selectedPastPaper.questions[pastPaperPracticeState.currentIndex].q}</p>
                    </div>

                    <div className="space-y-2.5">
                      {selectedPastPaper.questions[pastPaperPracticeState.currentIndex].options.map((opt: string) => {
                        const letterIndex = opt.startsWith('0') || opt.includes('Moment') ? 'A' : opt.startsWith('1') || opt.includes('Slope') || opt.includes('1.15') ? 'B' : opt.startsWith('2') || opt.includes('Consistent') || opt.includes('1.4') ? 'C' : 'D';
                        const isSelected = pastPaperPracticeState.answers[pastPaperPracticeState.currentIndex] === letterIndex;
                        
                        return (
                          <button
                            key={opt}
                            disabled={pastPaperPracticeState.submitted}
                            onClick={() => handleSelectPastPaperAnswer(pastPaperPracticeState.currentIndex, letterIndex)}
                            className={`w-full p-3 rounded-xl border text-left text-xs font-extrabold flex items-center gap-3 transition-colors ${
                              isSelected
                                ? 'bg-blue-50 border-blue-400 text-blue-900'
                                : 'bg-white border-gray-200 hover:bg-slate-50 cursor-pointer'
                            }`}
                          >
                            <span className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px]">{letterIndex}</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {pastPaperPracticeState.submitted && (
                      <div className="p-4 bg-blue-50 text-blue-900 text-xs rounded-xl border border-blue-100 space-y-1">
                        <p className="font-extrabold uppercase">Tutor Explanation:</p>
                        <p>{selectedPastPaper.questions[pastPaperPracticeState.currentIndex].explanation}</p>
                      </div>
                    )}

                    <div className="flex justify-between pt-4 border-t border-gray-50">
                      <button
                        disabled={pastPaperPracticeState.currentIndex === 0}
                        onClick={() => setPastPaperPracticeState({ ...pastPaperPracticeState, currentIndex: pastPaperPracticeState.currentIndex - 1 })}
                        className="px-4 py-2 bg-slate-100 text-gray-600 rounded-xl text-[10px] font-black uppercase disabled:opacity-50"
                      >
                        Previous
                      </button>

                      {pastPaperPracticeState.currentIndex < selectedPastPaper.questions.length - 1 ? (
                        <button
                          onClick={() => setPastPaperPracticeState({ ...pastPaperPracticeState, currentIndex: pastPaperPracticeState.currentIndex + 1 })}
                          className="px-4 py-2 bg-[#1A56A0] text-white rounded-xl text-[10px] font-black uppercase"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          disabled={pastPaperPracticeState.submitted}
                          onClick={handleSubmitPastPaperPractice}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow"
                        >
                          Submit Test Paper
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">Practice Statistics</h4>
              <p className="text-[10px] text-gray-400 mb-4 font-semibold">Track your readiness for semester exams.</p>
              
              <div className="space-y-3 text-xs">
                <div className="p-2.5 bg-gray-50 rounded-xl flex justify-between">
                  <span className="font-bold text-gray-500">Total Exams Attempted</span>
                  <span className="font-black text-gray-900">12 Session</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl flex justify-between">
                  <span className="font-bold text-gray-500">Average Score</span>
                  <span className="font-black text-gray-900">82%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: SCHOLARSHIPS & INTERNSHIPS
         ========================================== */}
      {activeTab === 'Scholarships & Internships' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* List of Scholarships */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Academic Scholarships & Industry Grants</h3>
              <div className="space-y-4">
                {scholarships.map(sch => (
                  <div key={sch.id} className="p-4 border border-gray-50 dark:border-slate-700 rounded-2xl hover:bg-gray-50/50 transition-all text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <p className="text-[10px] font-black text-[#1A56A0] uppercase tracking-wider">{sch.provider}</p>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide">{sch.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{sch.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs font-black text-gray-900 dark:text-white uppercase">{sch.amount}</span>
                      <span className="text-[9px] text-rose-500 font-bold uppercase">Deadline: {sch.deadline}</span>
                      <button
                        onClick={() => {
                          setSelectedScholarship(sch);
                          setScholarshipModalOpen(true);
                        }}
                        className="px-4 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer mt-1"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List of Internships */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Vetted SIWES & Summer Internships</h3>
              <div className="space-y-4">
                {internships.map(intern => {
                  const status = appliedInternships[intern.id] || 'Open';
                  return (
                    <div key={intern.id} className="p-4 border border-gray-50 dark:border-slate-700 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-[#1A56A0] uppercase tracking-wider">{intern.firm}</p>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide">{intern.title}</h4>
                        <div className="flex gap-2 text-[10px] text-gray-400 font-semibold mt-1">
                          <span>Location: {intern.location}</span>
                          <span>| Duration: {intern.duration}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs font-black text-gray-900 dark:text-white">{intern.allowance}</span>
                        <button
                          onClick={() => handleApplyInternship(intern.id, intern.title, intern.firm)}
                          disabled={status === 'Applied'}
                          className={`px-4 py-2 mt-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                            status === 'Applied'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#1A56A0] hover:bg-blue-700 text-white shadow'
                          }`}
                        >
                          {status === 'Applied' ? 'CV Transmitted!' : 'Transmit CV'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3">Academic Requirements</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Most scholarship donors mandate verified CGPA transcripts above 3.5 / 5.0 and active university student verification letters.
              </p>
            </div>

            {/* List applications */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">My Applications Log</h3>
              <div className="space-y-3">
                {scholarshipApplications.map(app => (
                  <div key={app.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between text-left">
                    <div>
                      <h4 className="text-[11px] font-black text-gray-900 uppercase truncate max-w-[130px]">{app.title}</h4>
                      <p className="text-[9px] text-gray-400 font-semibold">{app.date}</p>
                    </div>
                    <span className="text-[9px] bg-blue-50 text-[#1A56A0] px-2 py-0.5 rounded font-black uppercase">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHOLARSHIP MODAL */}
      {scholarshipModalOpen && selectedScholarship && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleApplyScholarship} className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-gray-100 shadow-xl overflow-hidden text-left">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-black tracking-wider text-[#1A56A0]">Academic Scholarship Application</span>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase truncate max-w-[300px]">{selectedScholarship.title}</h3>
              </div>
              <button type="button" onClick={() => setScholarshipModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">University / Institute</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UNILAG"
                    value={scholarshipForm.university}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, university: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Current CGPA (out of 5.0)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4.65"
                    value={scholarshipForm.gpa}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, gpa: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Brief Statement of Purpose</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain why you deserve this academic grant..."
                  value={scholarshipForm.statement}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, statement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#1A56A0]"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-50 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setScholarshipModalOpen(false)} className="px-4 py-2 text-xs font-black uppercase text-gray-400 hover:text-gray-600">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow">
                File Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: COMMUNITY
         ========================================== */}
      {activeTab === 'Community' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Thread starter */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3">Start Discussion Thread</h3>
              <form onSubmit={handleCreatePost} className="flex gap-3">
                <input
                  type="text"
                  required
                  placeholder="Ask a technical drawing, design, or career question to academic experts..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="flex-grow px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#1A56A0]"
                />
                <select
                  value={newPostCat}
                  onChange={(e) => setNewPostCat(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  <option value="Structural">Structural</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Quantity Surveying">QS</option>
                </select>
                <button type="submit" className="p-2.5 bg-[#1A56A0] text-white rounded-xl cursor-pointer">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* List of threads */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Student Guild Forum</h3>
              <div className="space-y-4">
                {forumPosts.map(post => {
                  const isExpanded = activeThreadId === post.id;
                  const comments = threadComments[post.id] || [];
                  return (
                    <div key={post.id} className="p-4 border border-gray-100 dark:border-slate-700 rounded-2xl text-left space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 cursor-pointer flex-1" onClick={() => setActiveThreadId(isExpanded ? null : post.id)}>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">{post.category}</span>
                            <span className="text-[10px] text-gray-400 font-bold">{post.replies} replies</span>
                          </div>
                          <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase mt-1 hover:text-[#1A56A0] transition-colors">{post.title}</h4>
                          <p className="text-[10px] text-gray-400 font-semibold">Started by: {post.author}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setForumPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
                              addToast('success', 'Thread Endorsed', 'Upvoted discussion topic.');
                            }}
                            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 rounded-xl flex items-center gap-1 text-[10px] font-black uppercase cursor-pointer"
                          >
                            ▲ {post.likes} Upvotes
                          </button>
                          <button
                            onClick={() => setActiveThreadId(isExpanded ? null : post.id)}
                            className="px-3 py-1.5 bg-blue-50 text-[#1A56A0] dark:bg-slate-700 rounded-xl text-[10px] font-black uppercase cursor-pointer"
                          >
                            {isExpanded ? 'Hide' : 'Comment & View'}
                          </button>
                        </div>
                      </div>

                      {/* Comments block */}
                      {isExpanded && (
                        <div className="mt-4 border-t border-gray-50 dark:border-slate-700/50 pt-4 space-y-4">
                          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Replies & Comments</h5>
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            {comments.map(c => (
                              <div key={c.id} className="p-3 bg-gray-50 dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-slate-800 text-xs">
                                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                  <span>{c.author} ({c.role})</span>
                                  <span>{c.date}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mt-1.5 leading-relaxed">{c.content}</p>
                              </div>
                            ))}
                            {comments.length === 0 && (
                              <p className="text-[11px] text-gray-400 italic">No comments yet. Be the first to reply!</p>
                            )}
                          </div>

                          {/* Post comment form */}
                          <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Write a comment as a student..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="flex-grow px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#1A56A0]"
                            />
                            <button type="submit" className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl cursor-pointer">
                              Reply
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3">Upcoming Webinars</h4>
              <div className="space-y-3 text-xs">
                <div className="p-2.5 border border-gray-50 rounded-lg">
                  <p className="font-extrabold text-gray-800">Foundation Loading & Deep Soil Analysis</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">July 10, 4:00 PM | Engr. Alabi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: CAREER CENTRE
         ========================================== */}
      {activeTab === 'Career Centre' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* CV Builder parameters form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Academic Resume Builder</h3>
              <form onSubmit={handleSaveCV} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Full Name</label>
                    <input
                      type="text"
                      value={cvData.fullName}
                      onChange={(e) => setCvData({ ...cvData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={cvData.email}
                      onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={cvData.phone}
                      onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase">CGPA Transcript</label>
                    <input
                      type="text"
                      value={cvData.cgpa}
                      onChange={(e) => setCvData({ ...cvData, cgpa: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Key Technical Experience</label>
                  <textarea
                    rows={3}
                    value={cvData.experience}
                    onChange={(e) => setCvData({ ...cvData, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Key Skills (comma separated)</label>
                    <input
                      type="text"
                      value={cvData.skills}
                      onChange={(e) => setCvData({ ...cvData, skills: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Professional Affiliations</label>
                    <input
                      type="text"
                      value={cvData.certifications}
                      onChange={(e) => setCvData({ ...cvData, certifications: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="px-5 py-2.5 bg-[#1A56A0] text-white text-xs font-black uppercase rounded-xl shadow hover:bg-blue-700">
                  Save Resume Data
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            {/* Dynamic CV Live Sheet */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-[9px] bg-[#1A56A0] text-white px-2 py-0.5 rounded font-black">CURRICULUM VITAE</span>
                <span className="text-[9px] text-gray-400 font-bold">PREVIEW TEMPLATE</span>
              </div>

              <div className="space-y-2.5 text-[10px]">
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-wide">{cvData.fullName}</h4>
                  <p className="text-gray-500 font-medium">{cvData.email} | {cvData.phone}</p>
                </div>

                <div className="border-t pt-2 space-y-1">
                  <h5 className="font-black text-gray-800 uppercase tracking-widest text-[9px]">Education</h5>
                  <p className="font-bold">{cvData.university}</p>
                  <p className="text-gray-500 font-semibold">Cumulative Grade Point Average: {cvData.cgpa}</p>
                </div>

                <div className="border-t pt-2 space-y-1">
                  <h5 className="font-black text-gray-800 uppercase tracking-widest text-[9px]">Engineering Experience</h5>
                  <p className="text-gray-600 leading-relaxed font-semibold">{cvData.experience}</p>
                </div>

                <div className="border-t pt-2 space-y-1">
                  <h5 className="font-black text-gray-800 uppercase tracking-widest text-[9px]">Competencies</h5>
                  <p className="text-gray-600 font-semibold">{cvData.skills}</p>
                </div>

                <div className="border-t pt-2 space-y-1">
                  <h5 className="font-black text-gray-800 uppercase tracking-widest text-[9px]">Certificates</h5>
                  <p className="text-gray-600 font-semibold">{cvData.certifications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: SETTINGS
         ========================================== */}
      {activeTab === 'Settings' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm max-w-2xl text-left space-y-6">
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Student Academic Settings</h3>
            <p className="text-xs text-gray-400 mt-1">Configure study preferences, university transcripts, and ecosystem dashboard indicators.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-black text-[#1A56A0] uppercase">University Account Verified</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Your status has been vetted using the University of Lagos academic registrars database.</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200">
                Active & Vetted
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase">Notification Channel</label>
                <select className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xl font-bold">
                  <option>Email & In-App Alerts</option>
                  <option>Email Only</option>
                  <option>Do Not Disturb</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase">Ecosystem Profile Visibility</label>
                <select className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xl font-bold">
                  <option>Visible to Vetted Mentors & Hirers</option>
                  <option>Private Study Profile</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => addToast('success', 'Preferences Applied', 'Your educational preferences have been applied and cached.')}
              className="px-5 py-2.5 bg-[#1A56A0] text-white font-black uppercase text-[10px] tracking-wider rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Apply Configurations
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import { useAuth } from './context/AuthContext';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import TopBar        from './components/Topbar';
import Sidebar       from './components/Sidebar';
import NotifPanel    from './components/NotifPanel';
import SettingsModal from './components/SettingsModal';
import Home          from './pages/Home';
import CoursePage    from './pages/CoursePage';
import LessonPage    from './pages/LessonPage';
import ChallengePage from './pages/ChallengePage';
import Notebook      from './pages/NotebookBook';
import htmlcss       from './data/htmlcss';
import python        from './data/python';
import PixelPuzzle   from './pages/PixelPuzzle';
import { usePuzzle } from './context/PuzzleContext';
import CoursesPage    from './pages/CoursesPage';
import ChallengesPage from './pages/ChallengesPage';
import RaceWorkspace from './pages/RaceWorkspace';
import RacesPage from './pages/RacesPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage    from './pages/LoginPage';
import ProfilePage  from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import LevelGate     from './components/LevelGate';
import { RACES } from './data/races';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import { LESSONS, TOTAL_LESSONS, LESSON_CHIPS }           from './data/lessons/htmlcss';
import { HTMLCSS_CHALLENGES, TOTAL_CHALLENGES }           from './data/challenges/htmlcss';
import { saveSession, getSession } from './utils/lastSession';
import { useState } from 'react';
import './App.css';

const COURSE_MAP = { htmlcss, python };
const LESSON_MAP = {
  htmlcss: { lessons: LESSONS, total: TOTAL_LESSONS, chips: LESSON_CHIPS },
};
const CHALLENGE_MAP = {
  htmlcss: { challenges: HTMLCSS_CHALLENGES, total: TOTAL_CHALLENGES },
};

function LessonRoute() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const course = COURSE_MAP[courseId];
  const ld = LESSON_MAP[courseId];
  if (!course) return null;
  return (
    <LessonPage
      courseId={courseId}
      lessonId={Number(lessonId)}
      totalLessons={ld?.total ?? TOTAL_LESSONS}
      lessons={ld?.lessons ?? LESSONS}
      lessonChips={ld?.chips ?? LESSON_CHIPS}
      onBack={() => navigate(`/courses/${courseId}`)}
      onNavigate={(id) => {
        saveSession({ courseId, lessonId: id });
        navigate(`/courses/${courseId}/lesson/${id}`);
      }}
    />
  );
}

function ChallengeRoute() {
  const { courseId, challengeId } = useParams();
  const navigate = useNavigate();
  const cd = CHALLENGE_MAP[courseId];
  return (
    <ChallengePage
      courseId={courseId}
      challengeId={Number(challengeId)}
      totalChallenges={cd?.total ?? TOTAL_CHALLENGES}
      challenges={cd?.challenges ?? HTMLCSS_CHALLENGES}
      onBack={() => navigate('/challenges')}
      onNavigate={(id) => navigate(`/challenges/${courseId}/${id}`)}
    />
  );
}

function CourseRoute() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = COURSE_MAP[courseId];
  if (!course) return null;
  return (
    <CoursePage
      course={course}
      onBack={() => navigate('/courses')}
      onLesson={(id) => {
        saveSession({ courseId: course.id, lessonId: id });
        navigate(`/courses/${courseId}/lesson/${id}`);
      }}
    />
  );
}

function RaceRoute({ races }) {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const race = races?.find(r => String(r.id) === raceId);
  if (!race) return null;
  return <RaceWorkspace race={race} onBack={() => navigate('/races')} />;
}

function HomeRoute() {
  const navigate = useNavigate();
  return (
    <Home
      onCourseClick={(id) => navigate(`/courses/${id}`)}
      onChallengeClick={(courseId, id) => navigate(`/challenges/${courseId}/${id}`)}
      onGoTo={(page) => navigate(`/${page}`)}
      onRaceClick={(r) => navigate(`/races/${r.id}`)}
    />
  );
}

export default function App() {
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { hasNewPixel } = usePuzzle();
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  function handleNav(page) {
    if (page === 'course') {
      const session = getSession();
      if (session && COURSE_MAP[session.courseId]) {
        navigate(`/courses/${session.courseId}/lesson/${session.lessonId}`);
      } else {
        navigate('/');
        setTimeout(() => document.getElementById('kurslar')?.scrollIntoView({ behavior: 'smooth' }), 80);
      }
      return;
    }
    navigate(page === 'home' ? '/' : `/${page}`);
  }

  return (
    <>
      <TopBar />
<Sidebar
  onNav={handleNav}
  onNotif={()    => setNotifOpen(true)}
  onSettings={() => setSettingsOpen(true)}
  hasNewPixel={hasNewPixel}
/>
      <NotifPanel    open={notifOpen}    onClose={() => setNotifOpen(false)}    />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/profil" element={authLoading
          ? null
          : profile
            ? <ProfilePage onBack={() => navigate('/')} />
            : <LoginPage   onBack={() => navigate('/')} onSwitch={() => navigate('/register')} onForgotPassword={() => navigate('/forgot-password')} />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/puzzle" element={<PixelPuzzle />} />
        <Route path="/register" element={<RegisterPage onBack={() => navigate('/')} onSwitch={() => navigate('/login')} />} />
        <Route path="/login" element={<LoginPage onBack={() => navigate('/')} onSwitch={() => navigate('/register')} onForgotPassword={() => navigate('/forgot-password')} />} />
        <Route path="/courses" element={<CoursesPage onBack={() => navigate('/')} onCourseClick={(id) => navigate(`/courses/${id}`)} />} />
        <Route path="/courses/:courseId" element={<CourseRoute />} />
        <Route path="/courses/:courseId/lesson/:lessonId" element={<LevelGate><LessonRoute /></LevelGate>} />
        <Route path="/challenges" element={<ProtectedRoute><ChallengesPage onBack={() => navigate('/')} onChallengeClick={(courseId, id) => navigate(`/challenges/${courseId}/${id}`)} /></ProtectedRoute>} />
        <Route path="/challenges/:courseId/:challengeId" element={<ProtectedRoute><ChallengeRoute /></ProtectedRoute>} />
        <Route path="/races" element={<ProtectedRoute><RacesPage onBack={() => navigate('/')} onRaceClick={(r) => navigate(`/races/${r.id}`)} /></ProtectedRoute>} />
        <Route path="/races/:raceId" element={<ProtectedRoute><RaceRoute races={RACES} /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage onBack={() => navigate('/login')} />} />

      </Routes>
    </>
  );
}

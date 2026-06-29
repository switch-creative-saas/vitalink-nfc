import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { usePatientStore } from '@/store/usePatientStore';
import GlassTabBar from '@/components/ui/GlassTabBar';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import MeshGradientBackground from '@/components/ui/MeshGradientBackground';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Allergies from '@/pages/Allergies';
import Contacts from '@/pages/Contacts';
import Emergency from '@/pages/Emergency';
import Hospitals from '@/pages/Hospitals';
import Appointments from '@/pages/Appointments';
import Records from '@/pages/Records';
import Prescriptions from '@/pages/Prescriptions';
import Register from '@/pages/Register';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isUnlocked = usePatientStore((s) => s.isUnlocked);
  if (!isUnlocked) {
    return <Navigate to="/emergency" replace />;
  }
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  const isCardRegistered = usePatientStore((s) => s.isCardRegistered);
  const isUnlocked = usePatientStore((s) => s.isUnlocked);
  const isEmergency = location.pathname === '/emergency';
  const showLanguageSwitcher = isUnlocked || location.pathname === '/register' || isEmergency;

  if (!isCardRegistered && location.pathname !== '/register') {
    return <Navigate to="/register" replace />;
  }

  return (
    <>
      <MeshGradientBackground variant={isEmergency ? 'emergency' : 'default'} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/register" element={<Register />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/allergies" element={<ProtectedRoute><Allergies /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
          <Route path="/hospitals" element={<ProtectedRoute><Hospitals /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
      {showLanguageSwitcher && (
        <div className="fixed top-4 right-16 z-[55]">
          <LanguageSwitcher variant="icon" />
        </div>
      )}
      {isUnlocked && <GlassTabBar />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen relative">
            <AnimatedRoutes />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

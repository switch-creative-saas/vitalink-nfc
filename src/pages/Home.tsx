import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, ShieldAlert, Users, HeartPulse,
  Building2, CalendarCheck, FolderHeart, Pill,
  Sun, Moon, QrCode, Share2, Eye, EyeOff,
  Activity,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { usePatientStore } from '@/store/usePatientStore';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import QRCodeModal from '@/components/ui/QRCodeModal';
import SuccessState from '@/components/ui/SuccessState';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

const serviceTileVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, damping: 20, stiffness: 300 },
  },
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const patient = usePatientStore((s) => s.patient);

  const [showQr, setShowQr] = useState(false);
  const [showId, setShowId] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setHeaderScrolled(e.currentTarget.scrollTop > 20);
  }, []);

  const handleShare = () => {
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 2500);
  };

  const handleCardTilt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  }, []);

  const handleCardReset = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  }, []);

  const quickActions = [
    { icon: User, label: t.profile, path: '/profile', accent: '' },
    { icon: ShieldAlert, label: t.allergies, path: '/allergies', accent: 'border-l-4 border-l-severe' },
    { icon: Users, label: t.contacts, path: '/contacts', accent: '' },
    { icon: HeartPulse, label: t.emergency, path: '/emergency', accent: 'bg-gradient-to-b from-red-500/20 to-red-600/10 border-red-400/40' },
  ];

  const services = [
    { icon: Building2, label: t.myHospitals, desc: t.hospitalsDesc, path: '/hospitals', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: CalendarCheck, label: t.myAppointments, desc: t.appointmentsDesc, path: '/appointments', color: 'text-vita-purple', bg: 'bg-vita-purple/10' },
    { icon: FolderHeart, label: t.myRecords, desc: t.recordsDesc, path: '/records', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Pill, label: t.myPrescriptions, desc: t.prescriptionsDesc, path: '/prescriptions', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <motion.div
      className="min-h-screen pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -30 }}
      onScroll={handleScroll}
      style={{ overflowY: 'auto' }}
    >
      {/* Floating Header */}
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between',
          'transition-all duration-200',
          headerScrolled && 'backdrop-blur-2xl bg-white/30 dark:bg-vita-dark-base/35 shadow-sm dark:shadow-[0_8px_28px_rgba(147,51,234,0.18)]'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <HeartPulse size={20} className="text-vita-purple" />
          <span className="font-semibold text-lg text-foreground">{t.appName}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <GlassButton size="sm" className="w-10 h-10 p-0" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </GlassButton>
        </div>
      </motion.header>

      {/* Hero / Profile ID Card */}
      <motion.section className="px-5 pt-20 pb-6" variants={itemVariants}>
        <motion.div
          ref={cardRef}
          className={cn(
            'relative rounded-3xl p-6',
            'bg-white/65 dark:bg-vita-dark-surface/60 backdrop-blur-glass saturate-[120%]',
            'border border-white/50 dark:border-vita-dark-border',
            'dark:shadow-[0_8px_32px_rgba(147,51,234,0.25)]',
            'shadow-float',
            'transition-transform duration-200 ease-out'
          )}
          onMouseMove={handleCardTilt}
          onMouseLeave={handleCardReset}
          whileTap={{ scale: 0.98 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="glass-specular absolute inset-0 rounded-3xl pointer-events-none opacity-60" />
          {/* Top Row */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <button
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-vita-purple transition-colors"
              onClick={() => setShowQr(true)}
            >
              <QrCode size={14} />
              <span>QR</span>
            </button>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-vita-dark-textMuted bg-white/40 dark:bg-vita-dark-surfaceLight/55 px-2 py-0.5 rounded-full">
              {t.idCard}
            </span>
          </div>
          {/* Photo & Name */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vita-purple/30 to-indigo-500/30 border-4 border-white/60 shadow-lg flex items-center justify-center overflow-hidden">
              {patient.photoUrl ? (
                <img src={patient.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-vita-purple" />
              )}
            </div>
            <h2 className="mt-3 text-xl font-bold text-foreground">{patient.fullName}</h2>
            <p className="text-xs text-vita-purple font-medium uppercase">{t.vitalinkMember}</p>
          </div>
          {/* VitaLink ID */}
          <div className="relative z-10 flex items-center justify-center gap-2 mt-4">
            <span className="text-sm font-mono text-muted-foreground">
              {showId ? patient.vitalinkId : `VL-\u2022\u2022\u2022\u2022-${patient.vitalinkId.slice(-4)}`}
            </span>
            <button
              className="w-7 h-7 rounded-full bg-white/40 dark:bg-vita-dark-surfaceLight/55 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); setShowId(!showId); }}
              aria-label={showId ? 'Hide ID' : 'Show ID'}
            >
              {showId ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.div className="flex justify-center mt-3" variants={itemVariants}>
          <GlassButton size="sm" icon={<Share2 size={14} />} onClick={handleShare}>
            {t.shareMedicalAccess}
          </GlassButton>
        </motion.div>
      </motion.section>

      {/* Quick Action Buttons */}
      <motion.section className="px-5 py-2" variants={itemVariants}>
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action) => (
            <motion.button
              key={action.path}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-2xl',
                'bg-white/65 dark:bg-vita-dark-surface/60 backdrop-blur-glass',
                'border border-white/50 dark:border-vita-dark-border',
                'dark:shadow-[0_8px_28px_rgba(147,51,234,0.22)]',
                'shadow-glass',
                action.accent,
              )}
              onClick={() => navigate(action.path)}
              whileTap={{ scale: 0.97 }}
              variants={itemVariants}
            >
              <action.icon size={22} className={cn(
                action.path === '/emergency' ? 'text-red-500' : 'text-vita-purple'
              )} />
              <span className={cn(
                'text-[11px] font-medium',
                action.path === '/emergency' ? 'text-red-600' : 'text-foreground'
              )}>
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Emergency button pulse for the emergency action */}
      <style>{`
        @keyframes emergency-pulse-home {
          0%, 100% { box-shadow: 0 0 12px rgba(220,38,38,0.15); }
          50% { box-shadow: 0 0 24px rgba(220,38,38,0.3); }
        }
      `}</style>

      {/* Service Tiles Grid */}
      <motion.section className="px-5 py-4" variants={containerVariants}>
        <div className="grid grid-cols-2 gap-3">
          {services.map((service) => (
            <motion.div key={service.path} variants={serviceTileVariants}>
              <GlassCard
                className="p-4 cursor-pointer"
                onClick={() => navigate(service.path)}
              >
                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', service.bg)}>
                  <service.icon size={24} className={service.color} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{service.label}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{service.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Vitality Core (Compact) */}
      <motion.section className="px-5 py-4" variants={itemVariants}>
        <GlassCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <div className="absolute inset-0 rounded-full animate-vital-cycle opacity-30 blur-xl" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-vita-purple/20 to-indigo-500/20 flex items-center justify-center border border-white/30">
                <HeartPulse size={28} className="text-vita-purple animate-heartbeat" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{t.yourVitals}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t.allIndicatorsNormal}</p>
              {/* Mini sparkline */}
              <svg className="mt-2 w-full h-6" viewBox="0 0 100 20" preserveAspectRatio="none">
                <polyline
                  points="0,15 20,12 40,14 60,8 80,10 100,6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-emerald-500"
                />
                <polyline
                  points="0,18 20,16 40,17 60,14 80,15 100,12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-blue-400 opacity-50"
                />
              </svg>
            </div>
          </div>
        </GlassCard>
      </motion.section>

      {/* Recent Activity Preview */}
      <motion.section className="px-5 py-4" variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">{t.recentActivity}</h3>
          <span className="text-xs text-vita-purple font-medium">{t.viewAll}</span>
        </div>
        <div className="space-y-2">
          <GlassCard className="p-3" noSpecular>
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-vita-purple flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t.fullBloodCount}</p>
                <p className="text-xs text-muted-foreground">{t.cityGeneralHospital}</p>
              </div>
              <span className="text-xs text-muted-foreground">{t.yesterday}</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            </div>
          </GlassCard>
          <GlassCard className="p-3" noSpecular>
            <div className="flex items-center gap-3">
              <Pill size={16} className="text-amber-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t.amoxicillinRefill}</p>
                <p className="text-xs text-muted-foreground">{t.stMarysPharmacy}</p>
              </div>
              <span className="text-xs text-muted-foreground">{t.twoDaysAgo}</span>
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
            </div>
          </GlassCard>
        </div>
      </motion.section>

      {/* Bottom safe area for tab bar */}
      <div className="h-8" />

      {/* Modals */}
      <QRCodeModal
        isOpen={showQr}
        onClose={() => setShowQr(false)}
        value={patient.vitalinkId}
      />
      <SuccessState show={showShareSuccess} message={t.copy} />
    </motion.div>
  );
};

export default Home;

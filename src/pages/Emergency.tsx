import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Phone, HeartPulse, AlertTriangle,
  Droplet, Calendar, User, Fingerprint, Ruler, Weight,
  Share2, Wind, MessageCircle, MapPin,
  ChevronDown, Pill,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePatientStore } from '@/store/usePatientStore';
import PublicEmergencyView from '@/components/PublicEmergencyView';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import SuccessState from '@/components/ui/SuccessState';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

const Emergency: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { patient, allergies, conditions, contacts, isUnlocked } = usePatientStore();

  const [isActive, setIsActive] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [expandedInstruction, setExpandedInstruction] = useState<string | null>(null);

  const primaryContact = contacts.find((c) => c.isPrimary);
  const severeAllergies = allergies.filter((a) => a.severity === 'severe');
  allergies.filter((a) => a.severity === 'moderate');
  allergies.filter((a) => a.severity === 'mild');

  const handleShareInfo = () => {
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 2500);
  };

  const handleBroadcast = () => {
    const text = encodeURIComponent(
      `🚨 EMERGENCY ALERT 🚨\n\nPatient: ${patient.fullName}\nBlood Type: ${patient.bloodType}\nVitaLink ID: ${patient.vitalinkId}\n\nThis is an automated alert from VitaLink.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const instructions = [
    {
      id: 'severe-allergic',
      icon: AlertTriangle,
      title: t.severeAllergicReaction,
      steps: [t.step1Call112, t.step2Epinephrine, t.step3Position, t.step4NoOral],
    },
    {
      id: 'asthma-attack',
      icon: Wind,
      title: t.asthmaAttack,
      steps: [t.step1Inhaler, t.step2Upright, t.step3CallHelp],
    },
    {
      id: 'cpr',
      icon: HeartPulse,
      title: t.cprCardiacArrest,
      steps: [t.step1Call112CPR, t.step2Compressions, t.step3AED],
    },
  ];

  if (!isUnlocked) {
    return <PublicEmergencyView />;
  }

  return (
    <motion.div
      className="min-h-screen pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 30 }}
    >
      {/* Status Header */}
      <motion.header className="px-4 pt-4 pb-3 flex items-center justify-between" variants={itemVariants}>
        <GlassButton size="sm" className="text-xs" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> {t.back}
        </GlassButton>
        <motion.button
          className={cn(
            'rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider',
            isActive
              ? 'bg-red-600/80 text-white relative'
              : 'bg-white/60 dark:bg-vita-dark-surfaceLight/55 backdrop-blur-glass text-muted-foreground dark:text-vita-dark-textMuted border border-white/30 dark:border-vita-dark-border'
          )}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive && (
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping-slow opacity-30" />
          )}
          <span className="relative z-10">
            {isActive ? t.emergencyActive : t.standbyMode}
          </span>
        </motion.button>
        <div className="w-16" />
      </motion.header>

      {/* Alert Banner */}
      <motion.section className="px-5 pt-6 pb-4" variants={itemVariants}>
        <div className={cn(
          'rounded-3xl p-5',
          'bg-red-600/15 border border-red-500/40',
          isActive && 'animate-pulse'
        )}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              {t.criticalInformation}
            </span>
          </div>
          <div className="border-t border-red-500/20 my-3" />
          <h1 className="text-2xl font-bold text-foreground">{patient.fullName}</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className={cn(
              'bg-red-600 text-white rounded-xl px-4 py-2 text-center',
              'shadow-lg shadow-red-600/20'
            )}>
              <p className="text-[10px] uppercase tracking-wider opacity-80">{t.bloodType}</p>
              <p className="text-2xl font-black">{patient.bloodType}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p><Calendar size={14} className="inline mr-1" />{patient.dateOfBirth}</p>
              <p className="mt-0.5"><Fingerprint size={14} className="inline mr-1" />{patient.vitalinkId}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Primary Emergency Actions */}
      <motion.section className="px-5 py-3 space-y-3" variants={containerVariants}>
        <motion.a
          href="tel:112"
          className={cn(
            'flex items-center justify-center gap-2 h-16 rounded-2xl',
            'bg-red-600 text-white font-semibold text-lg',
            'shadow-lg shadow-red-600/30'
          )}
          whileTap={{ scale: 0.96 }}
          variants={itemVariants}
        >
          <Phone size={20} />
          <span>{t.callEmergencyServices}</span>
          <span className="text-sm opacity-80">112</span>
        </motion.a>

        {primaryContact && (
          <motion.a
            href={`tel:${primaryContact.phone.replace(/\s/g, '')}`}
            className={cn(
              'flex items-center justify-center gap-2 h-16 rounded-2xl',
              'bg-vita-dark-surface/70 backdrop-blur-glass text-white dark:text-vita-dark-text',
              'border border-white/20 dark:border-vita-dark-border',
              'dark:shadow-[0_8px_28px_rgba(147,51,234,0.24)]',
              'font-semibold text-lg'
            )}
            whileTap={{ scale: 0.96 }}
            variants={itemVariants}
          >
            <HeartPulse size={20} />
            <span>{t.callEmergencyContact}</span>
            <span className="text-sm opacity-80">{primaryContact.name.split(' ')[0]}</span>
          </motion.a>
        )}
      </motion.section>

      {/* Critical Medical Information */}
      <motion.section className="px-5 py-3" variants={itemVariants}>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-vita-purple">
              {t.medicalInfo}
            </h3>
            <GlassButton size="sm" icon={<Share2 size={14} />} onClick={handleShareInfo}>
              {t.share}
            </GlassButton>
          </div>
          <div className="space-y-2">
            {[
              { icon: Droplet, label: t.bloodType, value: patient.bloodType, highlight: true },
              { icon: Calendar, label: t.dateOfBirth, value: patient.dateOfBirth },
              { icon: User, label: t.gender, value: patient.gender },
              { icon: Fingerprint, label: 'VitaLink ID', value: patient.vitalinkId },
              { icon: Ruler, label: t.height, value: `${patient.height} cm` },
              { icon: Weight, label: t.weight, value: `${patient.weight} kg` },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon size={16} className={cn(
                  'text-muted-foreground flex-shrink-0',
                  item.highlight && 'text-red-600'
                )} />
                <span className="text-xs text-muted-foreground w-24">{item.label}</span>
                <span className={cn(
                  'text-sm font-medium',
                  item.highlight ? 'text-red-600 text-lg font-bold' : 'text-foreground'
                )}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.section>

      {/* Critical Allergies */}
      {severeAllergies.length > 0 && (
        <motion.section className="px-5 py-3" variants={containerVariants}>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {severeAllergies.map((allergy) => (
              <motion.div
                key={allergy.id}
                className={cn(
                  'flex-shrink-0 flex items-center gap-2 rounded-full px-4 py-2',
                  'bg-red-600/15 border border-red-500/40'
                )}
                variants={itemVariants}
              >
                <Pill size={14} className="text-red-600" />
                <span className="text-sm font-medium text-foreground">{allergy.name}</span>
                <span className="bg-red-600 text-white text-[10px] uppercase font-bold rounded-full px-2 py-0.5">
                  {t.severe}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Medical Conditions */}
      {conditions.length > 0 && (
        <motion.section className="px-5 py-2" variants={containerVariants}>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {conditions.map((cond) => (
              <motion.div
                key={cond.id}
                className={cn(
                  'flex-shrink-0 flex items-center gap-2 rounded-full px-4 py-2',
                  'bg-blue-500/15 border border-blue-500/40'
                )}
                variants={itemVariants}
              >
                <Wind size={14} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{cond.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Broadcast Alert */}
      <motion.section className="px-5 py-4" variants={itemVariants}>
        <GlassButton
          variant="whatsapp"
          fullWidth
          icon={<MessageCircle size={20} />}
          onClick={handleBroadcast}
          className="h-14 rounded-2xl"
        >
          {t.broadcastAlert}
        </GlassButton>
      </motion.section>

      {/* Emergency Contacts Grid */}
      <motion.section className="px-5 py-3" variants={containerVariants}>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-vita-purple mb-3">
          {t.emergencyContact}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {contacts.slice(0, 4).map((contact) => (
            <motion.div key={contact.id} variants={itemVariants}>
              <GlassCard className="p-4">
                <span className={cn(
                  'text-[10px] uppercase font-bold tracking-wider',
                  contact.isPrimary ? 'text-red-600' : contact.type === 'doctor' ? 'text-vita-purple' : 'text-muted-foreground'
                )}>
                  {contact.isPrimary ? t.primary : contact.type === 'doctor' ? t.doctor : t.contact}
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0',
                    contact.isPrimary ? 'bg-red-500' : contact.type === 'doctor' ? 'bg-vita-purple' : 'bg-gray-400'
                  )}>
                    {contact.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                  </div>
                </div>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className={cn(
                    'mt-3 w-10 h-10 rounded-full flex items-center justify-center',
                    contact.isPrimary ? 'bg-red-600' : contact.type === 'doctor' ? 'bg-vita-purple' : 'bg-gray-600',
                    'text-white'
                  )}
                >
                  <Phone size={16} />
                </a>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Location Services */}
      <motion.section className="px-5 py-3" variants={itemVariants}>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-vita-purple/15 flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-vita-purple" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{t.shareLocation}</p>
              <p className="text-xs text-muted-foreground">{t.sendLocationToEmergencyContacts}</p>
            </div>
          </div>
        </GlassCard>
      </motion.section>

      {/* Emergency Instructions */}
      <motion.section className="px-5 py-4 space-y-3" variants={containerVariants}>
        {instructions.map((inst) => (
          <motion.div key={inst.id} variants={itemVariants}>
            <GlassCard className="p-4" onClick={() => setExpandedInstruction(
              expandedInstruction === inst.id ? null : inst.id
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <inst.icon size={18} className="text-vita-purple" />
                  <span className="text-sm font-medium text-foreground">{inst.title}</span>
                </div>
                <motion.div
                  animate={{ rotate: expandedInstruction === inst.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-muted-foreground" />
                </motion.div>
              </div>
              <AnimatePresence>
                {expandedInstruction === inst.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <ol className="mt-3 space-y-2 list-decimal list-inside">
                      {inst.steps.map((step, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{step}</li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        ))}
      </motion.section>

      {/* Footer */}
      <motion.footer className="px-5 py-6 text-center" variants={itemVariants}>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <HeartPulse size={12} className="text-vita-purple" />
          {t.emergencyFooter}
        </p>
      </motion.footer>

      <SuccessState show={showShareSuccess} message={t.copy} />
    </motion.div>
  );
};

export default Emergency;

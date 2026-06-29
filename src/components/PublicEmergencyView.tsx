import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Droplet, HeartPulse, Phone, Pill, User, Wind } from 'lucide-react';
import { usePatientStore } from '@/store/usePatientStore';
import { useLanguage } from '@/context/LanguageContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassPill from '@/components/ui/GlassPill';
import PinUnlockSheet from '@/components/PinUnlockSheet';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

export default function PublicEmergencyView() {
  const { t } = useLanguage();
  const patient = usePatientStore((s) => s.patient);
  const allergies = usePatientStore((s) => s.allergies);
  const conditions = usePatientStore((s) => s.conditions);
  const contacts = usePatientStore((s) => s.contacts);
  const primaryContact = contacts.find((c) => c.isPrimary) ?? contacts[0];
  const [showUnlock, setShowUnlock] = useState(false);

  const severityVariant = (severity: string) => {
    if (severity === 'severe') return 'danger';
    if (severity === 'moderate') return 'warning';
    return 'default';
  };

  return (
    <motion.div
      className="min-h-screen px-4 pb-32 pt-8 max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 30 }}
    >
      <motion.header className="flex items-center justify-between mb-5" variants={itemVariants}>
        <div className="flex items-center gap-2">
          <HeartPulse size={22} className="text-red-600" />
          <span className="text-lg font-semibold">{t.appName}</span>
        </div>
        <GlassPill variant="danger" size="md">{t.emergencyProfile}</GlassPill>
      </motion.header>

      <motion.section variants={itemVariants}>
        <GlassCard className="p-5 border-l-4 border-l-red-500">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vita-purple/30 to-indigo-500/30 border-4 border-white/60 shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {patient.photoUrl ? (
                <img src={patient.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-vita-purple" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t.patient}</p>
              <h1 className="text-2xl font-bold text-foreground truncate">{patient.fullName}</h1>
              <p className="text-xs text-muted-foreground">{patient.vitalinkId}</p>
            </div>
            <div className="rounded-2xl bg-red-600 px-4 py-3 text-center text-white shadow-lg shadow-red-600/20">
              <p className="text-[10px] uppercase tracking-wider opacity-80">{t.blood}</p>
              <p className="text-3xl font-black">{patient.bloodType || '--'}</p>
            </div>
          </div>
        </GlassCard>
      </motion.section>

      <motion.section className="py-4 space-y-3" variants={containerVariants}>
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-600">
            <AlertTriangle size={14} /> {t.allergies}
          </h2>
          <div className="space-y-2">
            {allergies.length > 0 ? allergies.map((allergy) => (
              <GlassCard key={allergy.id} className={cn(
                'p-3',
                allergy.severity === 'severe' && 'border-l-4 border-l-red-500',
                allergy.severity === 'moderate' && 'border-l-4 border-l-amber-500',
                allergy.severity === 'mild' && 'border-l-4 border-l-yellow-400',
              )}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Pill size={16} className="text-red-600 flex-shrink-0" />
                    <span className="font-semibold text-foreground truncate">{allergy.name}</span>
                  </div>
                  <GlassPill variant={severityVariant(allergy.severity)}>
                    {allergy.severity === 'severe' ? t.severe : allergy.severity === 'moderate' ? t.moderate : t.mild}
                  </GlassPill>
                </div>
              </GlassCard>
            )) : (
              <p className="text-sm text-muted-foreground">{t.noKnownAllergies}</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-vita-purple">
            <Activity size={14} /> {t.conditions}
          </h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {conditions.length > 0 ? conditions.map((condition) => (
              <div
                key={condition.id}
                className="flex-shrink-0 flex items-center gap-2 rounded-full px-4 py-2 bg-blue-500/15 border border-blue-500/40"
              >
                <Wind size={14} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{condition.name}</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">{t.noConditionsListed}</p>
            )}
          </div>
        </div>
      </motion.section>

      {primaryContact && (
        <motion.section variants={itemVariants}>
          <GlassCard className="p-4 border-l-4 border-l-red-400">
            <p className="text-[10px] uppercase font-bold tracking-wider text-red-600">{t.emergencyContact}</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                {primaryContact.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground truncate">{primaryContact.name}</p>
                <p className="text-xs text-muted-foreground">{primaryContact.relationship}</p>
                <p className="text-xs text-muted-foreground">{primaryContact.phone}</p>
              </div>
              <a
                href={`tel:${primaryContact.phone.replace(/\s/g, '')}`}
                className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center"
              >
                <Phone size={18} />
              </a>
            </div>
          </GlassCard>
        </motion.section>
      )}

      <motion.div className="mt-6" variants={itemVariants}>
        <GlassButton
          variant="primary"
          className="w-full h-14 rounded-2xl"
          onClick={() => setShowUnlock(true)}
        >
          {t.thisIsMyCardSignIn}
        </GlassButton>
      </motion.div>

      <motion.footer className="py-6 text-center" variants={itemVariants}>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Droplet size={12} className="text-vita-purple" />
          {t.poweredBy}
        </p>
      </motion.footer>

      {showUnlock && <PinUnlockSheet onClose={() => setShowUnlock(false)} />}
    </motion.div>
  );
}

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Pill, Clock, Calendar, Stethoscope,
  AlertTriangle, ChevronDown, Download,
} from 'lucide-react';
import ReactQRCode from 'react-qr-code';
import { useLanguage } from '@/context/LanguageContext';
import { usePatientStore } from '@/store/usePatientStore';
import type { Prescription } from '@/data/mockPrescriptions';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import SuccessState from '@/components/ui/SuccessState';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

const statusConfig = {
  active: { label: 'Active', bg: 'bg-emerald-500', pill: 'bg-emerald-500/15 text-emerald-700' },
  completed: { label: 'Completed', bg: 'bg-gray-500', pill: 'bg-gray-500/15 text-gray-700' },
  expired: { label: 'Expired', bg: 'bg-red-500', pill: 'bg-red-500/15 text-red-700' },
};

const Prescriptions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { prescriptions } = usePatientStore();

  const [statusFilter, setStatusFilter] = useState<'active' | 'completed' | 'expired'>('active');
  const [expandedPres, setExpandedPres] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const active = prescriptions.filter((p) => p.status === 'active');
  const completed = prescriptions.filter((p) => p.status === 'completed');
  const expired = prescriptions.filter((p) => p.status === 'expired');

  const filtered = useMemo(() => {
    switch (statusFilter) {
      case 'active': return active;
      case 'completed': return completed;
      case 'expired': return expired;
    }
  }, [statusFilter, active, completed, expired]);

  const renderPrescriptionCard = (pres: Prescription) => {
    const isExpanded = expandedPres === pres.id;
    const status = statusConfig[pres.status];
    const isActive = pres.status === 'active';
    const isExpired = pres.status === 'expired';

    return (
      <motion.div key={pres.id} variants={itemVariants} layout>
        <GlassCard
          className={cn('p-4', !isActive && 'opacity-70')}
          onClick={() => setExpandedPres(isExpanded ? null : pres.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', 'bg-blue-500/15')}>
                <Pill size={18} className="text-blue-500" />
              </div>
              <div>
                <h4 className={cn('font-semibold', isExpired && 'line-through')}>{pres.medication}</h4>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] uppercase font-bold', status.pill)}>
                  {status.label}
                </span>
              </div>
            </div>
            {isActive && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-muted-foreground" />
              </motion.div>
            )}
          </div>

          {isActive && (
            <>
              <div className="border-t border-white/10 my-3" />
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{pres.frequency}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{pres.duration} ({pres.startDate})</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Stethoscope size={14} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{pres.prescribedBy}</p>
              </div>
              {pres.refillsRemaining >= 0 ? (
                <p className="text-xs text-vita-purple mt-2">{pres.refillsRemaining} {t.refillsRemaining}</p>
              ) : (
                <p className="text-xs text-emerald-600 mt-2">{t.unlimitedRefills}</p>
              )}
            </>
          )}

          {/* Expanded Detail */}
          <AnimatePresence>
            {isExpanded && isActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/10 mt-3 pt-3 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Generic:</span> {pres.genericName}
                  </p>
                  {pres.sideEffects && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 dark:text-amber-200">{pres.sideEffects}</p>
                    </div>
                  )}
                  {/* QR Code */}
                  <div className="flex flex-col items-center py-3">
                    <div className="bg-white p-3 rounded-xl">
                      <motion.div
                        whileTap={{ scale: 1.05 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ReactQRCode value={pres.qrValue} size={140} bgColor="#FFFFFF" fgColor="#000000" level="M" />
                      </motion.div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">{t.showPharmacy}</p>
                  </div>
                  <GlassButton
                    fullWidth
                    icon={<Download size={14} />}
                    onClick={() => { setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2500); }}
                  >
                    {t.downloadPDF}
                  </GlassButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expired warning */}
          {isExpired && (
            <p className="text-xs text-red-600 mt-2">{t.expiredWarning}</p>
          )}
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="min-h-screen pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 30 }}
    >
      {/* Header */}
      <motion.header className="px-4 pt-14 pb-2" variants={itemVariants}>
        <GlassButton size="sm" className="text-xs mb-3" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> {t.back}
        </GlassButton>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Pill size={24} className="text-vita-purple" /> {t.myPrescriptions}
        </h1>
      </motion.header>

      {/* Status Filter */}
      <motion.section className="px-5 py-3" variants={itemVariants}>
        <div className="flex rounded-full overflow-hidden border border-white/30 dark:border-vita-dark-border">
          {(['active', 'completed', 'expired'] as const).map((s, i) => (
            <button
              key={s}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium capitalize',
                statusFilter === s
                  ? 'bg-vita-purple text-white'
                  : 'bg-white/50 dark:bg-vita-dark-surfaceLight/55 text-foreground dark:text-vita-dark-text',
                i === 0 && 'rounded-l-full',
                i === 2 && 'rounded-r-full'
              )}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'active' ? t.active : s === 'completed' ? t.completed : t.expired}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Prescriptions List */}
      <motion.section className="px-5 py-2 space-y-3" variants={containerVariants}>
        <AnimatePresence mode="wait">
          {filtered.map(renderPrescriptionCard)}
        </AnimatePresence>
      </motion.section>

      {/* Completed Section (when filter is 'All' or 'completed') */}
      {statusFilter === 'active' && completed.length > 0 && (
        <motion.section className="px-5 py-4" variants={containerVariants}>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">{t.completed}</h3>
          <div className="space-y-2">
            {completed.map((pres) => (
              <motion.div key={pres.id} variants={itemVariants}>
                <div className="flex items-center gap-2 opacity-60 p-3 rounded-xl bg-white/30 dark:bg-vita-dark-surfaceLight/40">
                  <Pill size={14} className="text-gray-500" />
                  <span className="text-sm line-through">{pres.medication}</span>
                  <span className="text-[10px] bg-gray-500/15 text-gray-700 rounded-full px-2 py-0.5 ml-auto">
                    {t.completed}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <SuccessState show={showSuccess} message={t.success} />
    </motion.div>
  );
};

export default Prescriptions;

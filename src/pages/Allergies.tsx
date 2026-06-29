import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ShieldAlert, AlertTriangle, Pill,
  Wind as WindIcon, Activity,
  Plus, Trash2, Pencil, Check,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePatientStore } from '@/store/usePatientStore';
import type { Allergy, MedicalCondition } from '@/data/mockPatient';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassSheet from '@/components/ui/GlassSheet';
import GlassPill from '@/components/ui/GlassPill';
import SuccessState from '@/components/ui/SuccessState';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

const severityConfig = {
  severe: { color: 'red', border: 'border-l-red-500', bg: 'bg-red-600/15', borderColor: 'border-red-500/40' },
  moderate: { color: 'amber', border: 'border-l-amber-500', bg: 'bg-amber-500/15', borderColor: 'border-amber-500/40' },
  mild: { color: 'yellow', border: 'border-l-yellow-400', bg: 'bg-yellow-400/15', borderColor: 'border-yellow-400/40' },
};

const Allergies: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { allergies, conditions, addAllergy, removeAllergy } = usePatientStore();

  const [editMode, setEditMode] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newAllergy, setNewAllergy] = useState<{ name: string; severity: 'mild' | 'moderate' | 'severe'; reaction: string; management: string }>({ name: '', severity: 'mild', reaction: '', management: '' });

  const severe = allergies.filter((a) => a.severity === 'severe');
  const moderate = allergies.filter((a) => a.severity === 'moderate');
  const mild = allergies.filter((a) => a.severity === 'mild');

  const handleAdd = () => {
    if (!newAllergy.name.trim()) return;
    addAllergy({
      name: newAllergy.name,
      severity: newAllergy.severity,
      reaction: newAllergy.reaction || 'Reaction not specified',
      management: newAllergy.management || 'Consult your doctor',
      icon: 'Pill',
    });
    setShowAddSheet(false);
    setNewAllergy({ name: '', severity: 'mild', reaction: '', management: '' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const renderAllergyCard = (allergy: Allergy) => {
    const cfg = severityConfig[allergy.severity];
    return (
      <motion.div key={allergy.id} variants={itemVariants} layout>
        <GlassCard className={cn('p-4', cfg.border)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill size={18} className={cn(
                allergy.severity === 'severe' ? 'text-red-600' :
                allergy.severity === 'moderate' ? 'text-amber-600' : 'text-yellow-600'
              )} />
              <span className="font-semibold text-foreground">{allergy.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <GlassPill
                variant={allergy.severity === 'severe' ? 'danger' : allergy.severity === 'moderate' ? 'warning' : 'default'}
              >
                {allergy.severity === 'severe' ? t.severe : allergy.severity === 'moderate' ? t.moderate : t.mild}
              </GlassPill>
              {editMode && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center"
                  onClick={() => removeAllergy(allergy.id)}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 size={12} className="text-red-600" />
                </motion.button>
              )}
            </div>
          </div>
          <div className="border-t border-white/10 my-2" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">{t.reaction}:</span> {allergy.reaction}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="font-medium">{t.management}:</span> {allergy.management}
          </p>
        </GlassCard>
      </motion.div>
    );
  };

  const renderConditionCard = (cond: MedicalCondition) => (
    <motion.div key={cond.id} variants={itemVariants}>
      <GlassCard className="p-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-blue-500" />
          <span className="font-semibold text-foreground">{cond.name}</span>
          <GlassPill variant={cond.status === 'chronic' ? 'info' : 'success'}>
            {cond.status.toUpperCase()}
          </GlassPill>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{cond.description}</p>
      </GlassCard>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 30 }}
    >
      {/* Header */}
      <motion.header className="px-4 pt-14 pb-2 flex items-center justify-between" variants={itemVariants}>
        <GlassButton size="sm" className="text-xs" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> {t.back}
        </GlassButton>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert size={24} className="text-vita-purple" /> {t.allergies}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <GlassButton size="sm" icon={<Pencil size={14} />} onClick={() => setEditMode(!editMode)}>
            {editMode ? <Check size={14} /> : null}
          </GlassButton>
          <GlassButton size="sm" className="w-10 h-10 p-0" onClick={() => setShowAddSheet(true)}>
            <Plus size={18} />
          </GlassButton>
        </div>
      </motion.header>

      {/* Alert Banner */}
      {severe.length > 0 && (
        <motion.section className="px-5 py-3" variants={itemVariants}>
          <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-2">
            <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{t.severeAllergiesWarning}</p>
          </div>
        </motion.section>
      )}

      {/* Severe Allergies */}
      {severe.length > 0 && (
        <motion.section className="px-5 py-2 space-y-2" variants={containerVariants}>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-red-600">{t.severeAllergies}</h3>
          {severe.map(renderAllergyCard)}
        </motion.section>
      )}

      {/* Moderate Allergies */}
      {moderate.length > 0 && (
        <motion.section className="px-5 py-2 space-y-2" variants={containerVariants}>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-amber-600">{t.moderateAllergies}</h3>
          {moderate.map(renderAllergyCard)}
        </motion.section>
      )}

      {/* Mild Allergies */}
      {mild.length > 0 && (
        <motion.section className="px-5 py-2" variants={containerVariants}>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-yellow-600 mb-2">{t.mildSensitivities}</h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {mild.map((allergy) => (
              <motion.div
                key={allergy.id}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-yellow-400/15 border border-yellow-400/40"
                variants={itemVariants}
              >
                <WindIcon size={12} className="text-yellow-600" />
                <span className="text-sm text-yellow-800 dark:text-yellow-300">{allergy.name}</span>
                <span className="bg-yellow-400 text-white text-[10px] uppercase font-bold rounded-full px-1.5 py-0.5">{t.mild}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Medical Conditions */}
      {conditions.length > 0 && (
        <motion.section className="px-5 py-3 space-y-2" variants={containerVariants}>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-vita-purple">{t.medicalConditions}</h3>
          {conditions.map(renderConditionCard)}
        </motion.section>
      )}

      {/* Emergency Instructions */}
      <motion.section className="px-5 py-3" variants={itemVariants}>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-vita-purple" />
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-vita-purple">{t.emergencyInstructions}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {t.step1Call112} {t.step2Epinephrine} {t.step3Position}
          </p>
        </GlassCard>
      </motion.section>

      {/* Add Sheet */}
      <GlassSheet isOpen={showAddSheet} onClose={() => setShowAddSheet(false)} title={t.addAllergy}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.allergyName}</label>
            <input
              className="w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
              value={newAllergy.name}
              onChange={(e) => setNewAllergy({ ...newAllergy, name: e.target.value })}
              placeholder="e.g., Peanuts"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.severity}</label>
            <div className="flex gap-2">
              {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                <button
                  key={sev}
                  className={cn(
                    'flex-1 h-10 rounded-full text-sm font-medium capitalize',
                    newAllergy.severity === sev
                      ? sev === 'severe' ? 'bg-red-600 text-white' : sev === 'moderate' ? 'bg-amber-500 text-white' : 'bg-yellow-400 text-white'
                      : 'bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border'
                  )}
                  onClick={() => setNewAllergy({ ...newAllergy, severity: sev })}
                >
                  {sev === 'severe' ? t.severe : sev === 'moderate' ? t.moderate : t.mild}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.reaction}</label>
            <textarea
              className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm min-h-[80px] resize-none"
              value={newAllergy.reaction}
              onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
              placeholder="Describe the allergic reaction..."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.management}</label>
            <textarea
              className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm min-h-[60px] resize-none"
              value={newAllergy.management}
              onChange={(e) => setNewAllergy({ ...newAllergy, management: e.target.value })}
              placeholder="Management notes..."
            />
          </div>
          <GlassButton variant="primary" fullWidth onClick={handleAdd} className="h-12">
            {t.addEntry}
          </GlassButton>
        </div>
      </GlassSheet>

      <SuccessState show={showSuccess} message={t.success} />
    </motion.div>
  );
};

export default Allergies;

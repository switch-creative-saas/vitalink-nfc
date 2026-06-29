import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, User, Phone, Mail, MapPin, Building,
  Pencil, Droplet, Calendar, Ruler, Weight, Dna,
  Globe, Briefcase, Heart, Bell, Share2, Clock,
  Shield, Lock,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePatientStore } from '@/store/usePatientStore';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassToggle from '@/components/ui/GlassToggle';
import GlassSheet from '@/components/ui/GlassSheet';
import SuccessState from '@/components/ui/SuccessState';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { patient, updatePatient, setPhotoUrl, lock } = usePatientStore();

  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draft, setDraft] = useState({ ...patient });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const handleSave = () => {
    updatePatient(draft);
    setEditMode(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleCancel = () => {
    setDraft({ ...patient });
    setEditMode(false);
  };

  const handleLock = () => {
    lock();
    navigate('/emergency');
  };

  const infoSections = [
    {
      title: t.contactInformation,
      icon: Phone,
      items: [
        { icon: Phone, label: t.phone, value: patient.phone, key: 'phone' },
        { icon: Mail, label: t.email, value: patient.email, key: 'email' },
        { icon: MapPin, label: t.address, value: patient.address, key: 'address' },
        { icon: Building, label: 'State/LGA', value: `${patient.state}, ${patient.lga}`, key: 'state' },
      ],
    },
    {
      title: t.personalInformation,
      icon: User,
      grid: true,
      items: [
        { icon: Calendar, label: t.dateOfBirth, value: patient.dateOfBirth, key: 'dob' },
        { icon: Droplet, label: t.bloodType, value: patient.bloodType, key: 'bloodType', highlight: true },
        { icon: User, label: t.gender, value: patient.gender, key: 'gender' },
        { icon: Ruler, label: t.height, value: `${patient.height} cm`, key: 'height' },
        { icon: Weight, label: t.weight, value: `${patient.weight} kg`, key: 'weight' },
        { icon: Dna, label: 'Genotype', value: patient.genotype, key: 'genotype' },
      ] as Array<{icon: typeof Calendar; label: string; value: string; key: string; highlight?: boolean}>,
    },
    {
      title: t.medicalBackground,
      icon: Globe,
      items: [
        { icon: Globe, label: t.nationality, value: patient.nationality, key: 'nationality' },
        { icon: Briefcase, label: t.occupation, value: patient.occupation, key: 'occupation' },
        { icon: Heart, label: t.maritalStatus, value: patient.maritalStatus, key: 'maritalStatus' },
      ],
    },
  ];

  return (
    <motion.div
      className="min-h-screen pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 30 }}
    >
      {/* Header */}
      <motion.header className="px-4 pt-4 pb-2 flex items-center justify-between" variants={itemVariants}>
        <GlassButton size="sm" className="text-xs" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> {t.back}
        </GlassButton>
        <GlassButton
          size="sm"
          icon={<Pencil size={14} />}
          onClick={() => editMode ? handleSave() : setEditMode(true)}
        >
          {editMode ? t.done : t.editProfile}
        </GlassButton>
      </motion.header>

      {/* Hero */}
      <motion.section className="px-5 pt-6 pb-4 flex flex-col items-center" variants={itemVariants}>
        <div
          className="relative w-24 h-24 rounded-full cursor-pointer"
          onClick={() => editMode && fileInputRef.current?.click()}
        >
          <div className={cn(
            'w-full h-full rounded-full flex items-center justify-center overflow-hidden',
            'bg-gradient-to-br from-vita-purple/30 to-indigo-500/30',
            'border-4 border-white/60 shadow-lg',
            editMode && 'ring-2 ring-vita-purple ring-offset-2'
          )}>
            {patient.photoUrl ? (
              <img src={patient.photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User size={36} className="text-vita-purple" />
            )}
          </div>
          {editMode && (
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-vita-purple text-white flex items-center justify-center">
              <Pencil size={14} />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        {editMode && (
          <button className="mt-2 text-xs text-vita-purple font-medium" onClick={() => fileInputRef.current?.click()}>
            Change Photo
          </button>
        )}
        <h1 className="mt-3 text-2xl font-bold text-foreground">
          {editMode ? (
            <div className="flex gap-2">
              <input
                className="w-28 text-center bg-white/50 dark:bg-vita-dark-surfaceLight/55 rounded-lg px-2 py-1 text-lg border border-white/30 dark:border-vita-dark-border"
                value={draft.firstName}
                onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
              />
              <input
                className="w-28 text-center bg-white/50 dark:bg-vita-dark-surfaceLight/55 rounded-lg px-2 py-1 text-lg border border-white/30 dark:border-vita-dark-border"
                value={draft.lastName}
                onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
              />
            </div>
          ) : patient.fullName}
        </h1>
        <p className="text-sm text-muted-foreground">
          VitaLink Member since {patient.memberSince}
        </p>

        {editMode && (
          <motion.div className="flex gap-2 mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassButton size="sm" variant="primary" onClick={handleSave}>{t.save}</GlassButton>
            <GlassButton size="sm" onClick={handleCancel}>{t.cancel}</GlassButton>
          </motion.div>
        )}
      </motion.section>

      {/* Info Sections */}
      {infoSections.map((section) => (
        <motion.section key={section.title} className="px-5 py-2" variants={itemVariants}>
          <GlassCard className={cn('p-5', editMode && 'border-vita-purple/40')}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-vita-purple mb-3 flex items-center gap-1">
              <section.icon size={14} /> {section.title}
            </h3>
            <div className={cn(section.grid && 'grid grid-cols-2 gap-3')}>
              {section.items.map((item) => (
                <div key={item.key} className="flex items-start gap-2">
                  <item.icon size={16} className={cn(
                    'text-muted-foreground mt-0.5 flex-shrink-0',
                    'highlight' in item && item.highlight && 'text-red-600'
                  )} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase">{item.label}</p>
                    {editMode && item.key !== 'dob' && item.key !== 'bloodType' && item.key !== 'genotype' ? (
                      <input
                        className="w-full text-sm bg-white/50 dark:bg-vita-dark-surfaceLight/55 rounded px-2 py-0.5 border border-white/30 dark:border-vita-dark-border"
                        value={String((draft as unknown as Record<string, string>)[item.key] || item.value)}
                        onChange={(e) => setDraft({ ...draft, [item.key]: e.target.value })}
                      />
                    ) : (
                      <p className={cn(
                        'text-sm font-medium truncate',
                        'highlight' in item && item.highlight && 'text-red-600 font-bold'
                      )}>
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      ))}

      {/* Emergency Contact */}
      <motion.section className="px-5 py-2" variants={itemVariants}>
        <GlassCard
          className="p-5 border-l-4 border-l-red-400 cursor-pointer"
          onClick={() => navigate('/contacts')}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-2 flex items-center gap-1">
            <Shield size={14} /> {t.emergencyContact}
          </h3>
          <div className="flex items-center gap-2">
            <User size={16} className="text-vita-purple" />
            <p className="text-sm font-semibold">Maria Ali</p>
            <p className="text-xs text-muted-foreground">Sister</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Phone size={14} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">+234 805 123 4567</p>
          </div>
        </GlassCard>
      </motion.section>

      {/* Settings */}
      <motion.section className="px-5 py-2" variants={itemVariants}>
        <GlassCard className="p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-vita-purple mb-3">
            {t.settings}
          </h3>
          <div className="space-y-3">
            {[
              { icon: Bell, label: t.emergencyAlerts, key: 'emergencyAlerts' as const },
              { icon: MapPin, label: t.locationSharing, key: 'locationSharing' as const },
              { icon: Share2, label: t.dataSharing, key: 'dataSharing' as const },
              { icon: Clock, label: t.reminderNotifications, key: 'reminderNotifications' as const },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <setting.icon size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{setting.label}</span>
                </div>
                <GlassToggle
                  checked={patient[setting.key]}
                  onChange={(val) => updatePatient({ [setting.key]: val })}
                />
              </div>
            ))}
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-2xl bg-white/35 dark:bg-vita-dark-surfaceLight/40 border border-white/30 dark:border-vita-dark-border px-3 py-3 text-left"
              onClick={handleLock}
            >
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{t.lockFullAccess}</span>
              </div>
              <span className="text-xs font-medium text-vita-purple">{t.lockAction}</span>
            </button>
          </div>
        </GlassCard>
      </motion.section>

      {/* Danger Zone */}
      <motion.section className="px-5 py-6 text-center" variants={itemVariants}>
        <button
          className="text-sm text-red-600 font-medium"
          onClick={() => setShowDeleteConfirm(true)}
        >
          {t.requestDataDeletion}
        </button>
      </motion.section>

      {/* Delete Confirm Sheet */}
      <GlassSheet isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title={t.deleteConfirmTitle}>
        <p className="text-sm text-muted-foreground mb-4">{t.deleteConfirmMessage}</p>
        <div className="flex gap-3">
          <GlassButton fullWidth onClick={() => setShowDeleteConfirm(false)}>{t.cancel}</GlassButton>
          <GlassButton variant="danger" fullWidth onClick={() => {
            setShowDeleteConfirm(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2500);
          }}>{t.confirm}</GlassButton>
        </div>
      </GlassSheet>

      <SuccessState show={showSuccess} message={t.success} />
    </motion.div>
  );
};

export default Profile;

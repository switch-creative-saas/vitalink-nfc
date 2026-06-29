import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Users, Plus, Phone, MessageSquare, Mail,
  MapPin, Shield,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePatientStore } from '@/store/usePatientStore';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassSheet from '@/components/ui/GlassSheet';
import SuccessState from '@/components/ui/SuccessState';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { contacts, addContact } = usePatientStore();

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '', relationship: 'Family', phone: '', email: '', address: '', isPrimary: false, type: 'family' as const,
  });

  const primaryContact = contacts.find((c) => c.isPrimary);
  const medicalContacts = contacts.filter((c) => c.type === 'doctor');
  const otherContacts = contacts.filter((c) => !c.isPrimary && c.type !== 'doctor');

  const handleAdd = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return;
    addContact({ ...newContact });
    setShowAddSheet(false);
    setNewContact({ name: '', relationship: 'Family', phone: '', email: '', address: '', isPrimary: false, type: 'family' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleShareLocation = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  const renderContactCard = (contact: typeof contacts[0], variant: 'primary' | 'doctor' | 'other') => (
    <motion.div key={contact.id} variants={itemVariants}>
      <GlassCard className={cn('p-4', variant === 'primary' && 'border-l-4 border-l-red-500')}>
        {variant === 'primary' && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">{t.primary}</span>
        )}
        {variant === 'doctor' && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-vita-purple">{t.doctor}</span>
        )}
        <div className="flex items-center gap-3 mt-1">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0',
            variant === 'primary' ? 'bg-red-500' : variant === 'doctor' ? 'bg-vita-purple' : 'bg-gray-400'
          )}>
            {contact.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{contact.name}</p>
            <p className="text-xs text-muted-foreground">{contact.relationship}</p>
          </div>
        </div>
        {contact.phone && (
          <div className="flex items-center gap-2 mt-2">
            <Phone size={12} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{contact.phone}</p>
          </div>
        )}
        <div className="flex gap-2 mt-3">
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center',
              variant === 'primary' ? 'bg-red-600' : variant === 'doctor' ? 'bg-vita-purple' : 'bg-gray-600',
              'text-white'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Phone size={14} />
          </a>
          <a
            href={`sms:${contact.phone.replace(/\s/g, '')}`}
            className="w-9 h-9 rounded-full bg-white/50 dark:bg-vita-dark-surfaceLight/55 flex items-center justify-center border border-white/30 dark:border-vita-dark-border"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageSquare size={14} />
          </a>
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="w-9 h-9 rounded-full bg-white/50 dark:bg-vita-dark-surfaceLight/55 flex items-center justify-center border border-white/30 dark:border-vita-dark-border"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail size={14} />
            </a>
          )}
        </div>
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
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users size={24} className="text-vita-purple" /> {t.myContacts}
        </h1>
        <GlassButton size="sm" className="w-10 h-10 p-0" onClick={() => setShowAddSheet(true)}>
          <Plus size={18} />
        </GlassButton>
      </motion.header>

      {/* Primary Contact */}
      {primaryContact && (
        <motion.section className="px-5 py-3" variants={itemVariants}>
          {renderContactCard(primaryContact, 'primary')}
        </motion.section>
      )}

      {/* Medical Team */}
      {medicalContacts.length > 0 && (
        <motion.section className="px-5 py-2 space-y-2" variants={containerVariants}>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-vita-purple">{t.medicalTeam}</h3>
          {medicalContacts.map((c) => renderContactCard(c, 'doctor'))}
        </motion.section>
      )}

      {/* Other Contacts */}
      {otherContacts.length > 0 && (
        <motion.section className="px-5 py-2 space-y-2" variants={containerVariants}>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t.otherContacts}</h3>
          {otherContacts.map((c) => renderContactCard(c, 'other'))}
        </motion.section>
      )}

      {/* Emergency Protocol */}
      <motion.section className="px-5 py-3" variants={itemVariants}>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={18} className="text-vita-purple" />
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-vita-purple">{t.emergencyProtocol}</h3>
          </div>
          <ol className="space-y-1.5 list-decimal list-inside">
            <li className="text-sm text-muted-foreground">Call primary contact (Maria Ali)</li>
            <li className="text-sm text-muted-foreground">If no answer, call Dr. Sarah Johnson</li>
            <li className="text-sm text-muted-foreground">If emergency, call 112 immediately</li>
            <li className="text-sm text-muted-foreground">Share your location with contacts</li>
          </ol>
        </GlassCard>
      </motion.section>

      {/* Share Location */}
      <motion.section className="px-5 py-4" variants={itemVariants}>
        <GlassButton fullWidth icon={<MapPin size={18} />} onClick={handleShareLocation} className="h-14 rounded-2xl">
          {t.shareLocationContacts}
        </GlassButton>
      </motion.section>

      {/* Add Contact Sheet */}
      <GlassSheet isOpen={showAddSheet} onClose={() => setShowAddSheet(false)} title={t.addContact}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
            <input
              className="w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Relationship</label>
            <select
              className="w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
              value={newContact.relationship}
              onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
            >
              <option>Family</option>
              <option>Friend</option>
              <option>Doctor</option>
              <option>Workplace</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label>
            <input
              className="w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              placeholder="+234"
              type="tel"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
            <input
              className="w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              placeholder="email@example.com"
              type="email"
            />
          </div>
          <GlassButton variant="primary" fullWidth onClick={handleAdd} className="h-12">
            {t.add}
          </GlassButton>
        </div>
      </GlassSheet>

      <SuccessState show={showSuccess} message={t.success} />
      <SuccessState show={shareSuccess} message={`Location shared with ${contacts.length} contacts`} />
    </motion.div>
  );
};

export default Contacts;

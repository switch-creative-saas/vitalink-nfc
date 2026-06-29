import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, CalendarCheck, Clock,
  CalendarPlus, X, ChevronDown,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePatientStore } from '@/store/usePatientStore';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassSheet from '@/components/ui/GlassSheet';
import SuccessState from '@/components/ui/SuccessState';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';
import { availableTimeSlots } from '@/data/mockAppointments';

const statusConfig = {
  confirmed: { label: 'Confirmed', bg: 'bg-emerald-500/15', text: 'text-emerald-700' },
  pending: { label: 'Pending', bg: 'bg-amber-500/15', text: 'text-amber-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-500/15', text: 'text-red-700' },
  completed: { label: 'Completed', bg: 'bg-gray-500/15', text: 'text-gray-700' },
};

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { appointments, pastAppointments, addAppointment, removeAppointment } = usePatientStore();

  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5, 1));
  const [selectedDate, setSelectedDate] = useState(24);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('30');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedAppt, setExpandedAppt] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);
  const [newAppt, setNewAppt] = useState({ type: '', hospital: '', notes: '' });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = 24;

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleAdd = () => {
    if (!newAppt.type || !selectedTime) return;
    addAppointment({
      type: newAppt.type,
      hospital: newAppt.hospital || 'City General Hospital',
      date: `${selectedDate} Jun 2025`,
      day: selectedDate,
      month: 'JUN',
      time: `${selectedTime} — ${selectedDuration} min`,
      duration: `${selectedDuration} min`,
      status: 'pending',
      notes: newAppt.notes,
    });
    setShowAddSheet(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleCancel = (id: string) => {
    if (window.confirm(t.cancelConfirm)) {
      removeAppointment(id);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
          <CalendarCheck size={24} className="text-vita-purple" /> {t.myAppointments}
        </h1>
      </motion.header>

      {/* Calendar */}
      <motion.section className="px-5 py-3" variants={itemVariants}>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
              <ChevronLeft size={16} />
            </button>
            <h2 className="font-semibold">{monthNames[month]} {year}</h2>
            <button onClick={handleNextMonth} className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
              <div key={d} className="text-center text-[10px] text-muted-foreground uppercase font-medium py-1">
                {d}
              </div>
            ))}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isToday = day === today;
              const isSelected = day === selectedDate;
              const hasAppt = appointments.some((a) => a.day === day);
              return (
                <motion.button
                  key={day}
                  className={cn(
                    'aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative',
                    isToday && 'bg-vita-purple text-white font-bold',
                    isSelected && !isToday && 'bg-vita-purple/20 border border-vita-purple/40 text-vita-purple',
                    !isToday && !isSelected && 'text-foreground hover:bg-white/20'
                  )}
                  onClick={() => setSelectedDate(day)}
                  whileTap={{ scale: 0.9 }}
                >
                  {day}
                  {hasAppt && !isToday && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-vita-purple" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </GlassCard>
      </motion.section>

      {/* Time Slots */}
      <motion.section className="px-5 py-2" variants={containerVariants}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {availableTimeSlots.map((slot) => (
            <motion.button
              key={slot}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium',
                selectedTime === slot
                  ? 'bg-vita-purple text-white border border-vita-purple'
                  : 'bg-white/65 dark:bg-vita-dark-surface/60 backdrop-blur-glass border border-white/50 dark:border-vita-dark-border dark:shadow-[0_8px_28px_rgba(147,51,234,0.2)]'
              )}
              onClick={() => setSelectedTime(slot)}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              {slot}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Duration */}
      <motion.section className="px-5 py-2" variants={itemVariants}>
        <div className="flex gap-2">
          {['15', '30', '60'].map((d) => (
            <button
              key={d}
              className={cn(
                'flex-1 h-10 rounded-full text-sm font-medium',
                selectedDuration === d
                  ? 'bg-vita-purple text-white'
                  : 'bg-white/65 dark:bg-vita-dark-surface/60 border border-white/50 dark:border-vita-dark-border'
              )}
              onClick={() => setSelectedDuration(d)}
            >
              {d} min
            </button>
          ))}
        </div>
      </motion.section>

      {/* This Week */}
      <motion.section className="px-5 py-3" variants={containerVariants}>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-vita-purple mb-3">
          {t.thisWeek} ({appointments.length})
        </h3>
        <div className="space-y-3">
          {appointments.map((appt) => (
            <motion.div key={appt.id} variants={itemVariants} layout>
              <GlassCard
                className="p-4 cursor-pointer"
                onClick={() => setExpandedAppt(expandedAppt === appt.id ? null : appt.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-vita-purple/15 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-vita-purple">{appt.day}</span>
                    <span className="text-[10px] uppercase text-vita-purple">{appt.month}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{appt.type}</h4>
                    <p className="text-xs text-muted-foreground">{appt.hospital}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{appt.time}</span>
                    </div>
                    <span className={cn(
                      'inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] uppercase font-bold',
                      statusConfig[appt.status].bg,
                      statusConfig[appt.status].text
                    )}>
                      {statusConfig[appt.status].label}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedAppt === appt.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {expandedAppt === appt.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10 mt-3 pt-3 space-y-2">
                        {appt.doctor && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="font-medium">Dr:</span> {appt.doctor}
                          </p>
                        )}
                        {appt.notes && (
                          <p className="text-xs text-muted-foreground">{appt.notes}</p>
                        )}
                        {appt.preparation && (
                          <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 rounded-lg p-2">
                            {appt.preparation}
                          </p>
                        )}
                        <div className="flex gap-2 pt-1">
                          <GlassButton size="sm" icon={<Clock size={12} />} onClick={() => {}}>
                            {t.reschedule}
                          </GlassButton>
                          <GlassButton
                            size="sm"
                            className="text-red-600"
                            icon={<X size={12} />}
                            onClick={() => { handleCancel(appt.id); }}
                          >
                            Cancel
                          </GlassButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Book Button */}
      <motion.section className="px-5 py-4" variants={itemVariants}>
        <GlassButton
          variant="primary"
          fullWidth
          icon={<CalendarPlus size={20} />}
          onClick={() => setShowAddSheet(true)}
          className="h-14 rounded-2xl shadow-vita"
        >
          {t.bookNew}
        </GlassButton>
      </motion.section>

      {/* Past Appointments Toggle */}
      {pastAppointments.length > 0 && (
        <motion.section className="px-5 py-2 text-center" variants={itemVariants}>
          <button
            className="text-sm text-vita-purple font-medium"
            onClick={() => setShowPast(!showPast)}
          >
            {showPast ? t.hidePast : t.showPast}
          </button>
        </motion.section>
      )}

      {showPast && pastAppointments.length > 0 && (
        <motion.section className="px-5 py-2 space-y-3" variants={containerVariants}>
          {pastAppointments.map((appt) => (
            <motion.div key={appt.id} variants={itemVariants}>
              <GlassCard className="p-4 opacity-60">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gray-500/15 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-gray-500">{appt.day}</span>
                    <span className="text-[10px] uppercase text-gray-500">{appt.month}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground line-through">{appt.type}</h4>
                    <p className="text-xs text-muted-foreground">{appt.hospital}</p>
                    <span className="inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] uppercase font-bold bg-gray-500/15 text-gray-700">
                      {t.completed}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.section>
      )}

      {/* Add Sheet */}
      <GlassSheet isOpen={showAddSheet} onClose={() => setShowAddSheet(false)} title={t.bookAppointment}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
            <select
              className="w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
              value={newAppt.type}
              onChange={(e) => setNewAppt({ ...newAppt, type: e.target.value })}
            >
              <option value="">Select type</option>
              <option>Blood Test</option>
              <option>Consultation</option>
              <option>Physiotherapy</option>
              <option>Dental</option>
              <option>Eye Exam</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Hospital</label>
            <select
              className="w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
              value={newAppt.hospital}
              onChange={(e) => setNewAppt({ ...newAppt, hospital: e.target.value })}
            >
              <option value="">Select hospital</option>
              <option>City General Hospital</option>
              <option>Regional Emergency Clinic</option>
              <option>St. Mary&apos;s Medical Center</option>
              <option>Federal Medical Centre</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
            <textarea
              className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm min-h-[80px] resize-none"
              value={newAppt.notes}
              onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>
          <GlassButton variant="primary" fullWidth onClick={handleAdd} className="h-12">
            {t.confirmBooking}
          </GlassButton>
        </div>
      </GlassSheet>

      <SuccessState show={showSuccess} message={t.success} />
    </motion.div>
  );
};

export default Appointments;

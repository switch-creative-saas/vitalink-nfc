import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Building2, Search, X, Star, MapPin,
  Phone, Plus, SearchX,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePatientStore } from '@/store/usePatientStore';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassSheet from '@/components/ui/GlassSheet';
import GlassToggle from '@/components/ui/GlassToggle';
import SuccessState from '@/components/ui/SuccessState';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

const serviceColors: Record<string, string> = {
  Emergency: 'text-red-700 bg-red-500/15',
  Cardiology: 'text-pink-700 bg-pink-500/15',
  Pediatrics: 'text-blue-700 bg-blue-500/15',
  Surgery: 'text-purple-700 bg-purple-500/15',
  Radiology: 'text-cyan-700 bg-cyan-500/15',
  Trauma: 'text-red-700 bg-red-500/15',
  ICU: 'text-orange-700 bg-orange-500/15',
  Laboratory: 'text-teal-700 bg-teal-500/15',
  Maternity: 'text-rose-700 bg-rose-500/15',
  'General Practice': 'text-green-700 bg-green-500/15',
  Pharmacy: 'text-amber-700 bg-amber-500/15',
  Orthopedics: 'text-indigo-700 bg-indigo-500/15',
  Neurology: 'text-violet-700 bg-violet-500/15',
};

const Hospitals: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { hospitals, addHospital } = usePatientStore();

  const [search, setSearch] = useState('');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newHospital, setNewHospital] = useState({
    name: '', address: '', phone: '', services: [] as string[], is24_7: false, isGovernment: false, rating: 4,
  });
  const [serviceInput, setServiceInput] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return hospitals;
    const q = search.toLowerCase();
    return hospitals.filter((h) =>
      h.name.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      h.services.some((s) => s.toLowerCase().includes(q))
    );
  }, [hospitals, search]);

  const handleAdd = () => {
    if (!newHospital.name.trim()) return;
    addHospital({ ...newHospital });
    setShowAddSheet(false);
    setNewHospital({ name: '', address: '', phone: '', services: [], is24_7: false, isGovernment: false, rating: 4 });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const addService = () => {
    if (serviceInput.trim() && !newHospital.services.includes(serviceInput.trim())) {
      setNewHospital({ ...newHospital, services: [...newHospital.services, serviceInput.trim()] });
      setServiceInput('');
    }
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
          <Building2 size={24} className="text-vita-purple" /> {t.myHospitals}
        </h1>
      </motion.header>

      {/* Search */}
      <motion.section className="px-5 py-3 sticky top-0 z-10" variants={itemVariants}>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className={cn(
              'w-full h-12 pl-11 pr-10 rounded-2xl',
              'bg-white/65 dark:bg-vita-dark-surface/60 backdrop-blur-glass',
              'border border-white/50 dark:border-vita-dark-border',
              'dark:shadow-[0_8px_28px_rgba(147,51,234,0.2)]',
              'text-sm text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:border-vita-purple/50 transition-colors'
            )}
            placeholder={t.searchHospitals}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/40 flex items-center justify-center"
              onClick={() => setSearch('')}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </motion.section>

      {/* Hospital List */}
      <motion.section className="px-5 py-2 space-y-3" variants={containerVariants}>
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              className="flex flex-col items-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SearchX size={48} className="text-muted-foreground mb-3" />
              <p className="text-lg font-semibold text-foreground">{t.noHospitalsFound}</p>
              <p className="text-sm text-muted-foreground">{t.tryAdjustingSearch}</p>
            </motion.div>
          ) : (
            filtered.map((hospital) => (
              <motion.div key={hospital.id} variants={itemVariants} layout>
                <GlassCard className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                        <Building2 size={20} className="text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{hospital.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-500" />
                          <span className="text-xs text-muted-foreground">{hospital.rating}</span>
                        </div>
                      </div>
                    </div>
                    {hospital.is24_7 && (
                      <span className="bg-emerald-500/15 text-emerald-700 text-[10px] font-medium rounded-full px-2 py-0.5">
                        {t.open24_7}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{hospital.address}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone size={14} className="text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{hospital.phone}</p>
                  </div>
                  {/* Services */}
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mt-3 pb-1">
                    {hospital.services.slice(0, 5).map((service) => (
                      <span
                        key={service}
                        className={cn(
                          'flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium',
                          serviceColors[service] || 'text-gray-700 bg-gray-500/15'
                        )}
                      >
                        {service}
                      </span>
                    ))}
                    {hospital.services.length > 5 && (
                      <span className="flex-shrink-0 text-[10px] text-muted-foreground py-0.5">
                        +{hospital.services.length - 5} more
                      </span>
                    )}
                  </div>
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3">
                    <a
                      href={`tel:${hospital.phone.replace(/\s/g, '')}`}
                      className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone size={14} />
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/50 dark:bg-vita-dark-surfaceLight/55 flex items-center justify-center border border-white/30 dark:border-vita-dark-border"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MapPin size={14} />
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.section>

      {/* FAB */}
      <motion.button
        className={cn(
          'fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full',
          'bg-vita-purple text-white flex items-center justify-center',
          'shadow-vita animate-float'
        )}
        onClick={() => setShowAddSheet(true)}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.5 }}
      >
        <Plus size={24} />
      </motion.button>

      {/* Add Sheet */}
      <GlassSheet isOpen={showAddSheet} onClose={() => setShowAddSheet(false)} title={t.addHospital}>
        <div className="space-y-4">
          <input
            className="w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
            placeholder="Hospital name"
            value={newHospital.name}
            onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
          />
          <input
            className="w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
            placeholder="Address"
            value={newHospital.address}
            onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
          />
          <input
            className="w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
            placeholder="Phone"
            value={newHospital.phone}
            onChange={(e) => setNewHospital({ ...newHospital, phone: e.target.value })}
            type="tel"
          />
          <div>
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 h-10 px-4 rounded-full bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm"
                placeholder="Add service (e.g., Emergency)"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addService()}
              />
              <button
                className="h-10 px-4 rounded-full bg-vita-purple text-white text-sm"
                onClick={addService}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {newHospital.services.map((s, i) => (
                <span key={i} className="bg-vita-purple/15 text-vita-purple rounded-full px-2 py-0.5 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">24/7 Service</span>
            <GlassToggle checked={newHospital.is24_7} onChange={(v) => setNewHospital({ ...newHospital, is24_7: v })} />
          </div>
          <GlassButton variant="primary" fullWidth onClick={handleAdd} className="h-12">
            {t.add}
          </GlassButton>
        </div>
      </GlassSheet>

      <SuccessState show={showSuccess} message={t.success} />
    </motion.div>
  );
};

export default Hospitals;

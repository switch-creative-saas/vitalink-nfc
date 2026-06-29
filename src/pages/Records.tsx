import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, FolderHeart, Syringe, HeartPulse, Scan,
  TestTube, FileText, Share2, Upload,
  ChevronRight, Building2, Stethoscope,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePatientStore } from '@/store/usePatientStore';
import type { MedicalRecord } from '@/data/mockRecords';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassSheet from '@/components/ui/GlassSheet';
import SuccessState from '@/components/ui/SuccessState';
import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  vaccination: { icon: Syringe, color: 'text-emerald-500', bg: 'bg-emerald-500/15', label: 'Vaccination' },
  consultation: { icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-500/15', label: 'Consultation' },
  imaging: { icon: Scan, color: 'text-blue-500', bg: 'bg-blue-500/15', label: 'Imaging' },
  lab: { icon: TestTube, color: 'text-purple-500', bg: 'bg-purple-500/15', label: 'Lab Result' },
};

const categories = ['All', 'Lab Results', 'Imaging', 'Vaccinations', 'Consultations'];

const RecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { records, addRecord } = usePatientStore();

  const [activeCategory, setActiveCategory] = useState('All');
  const [showDetail, setShowDetail] = useState<MedicalRecord | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [uploadName, setUploadName] = useState('');

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return records;
    const map: Record<string, string> = {
      'Lab Results': 'lab',
      'Imaging': 'imaging',
      'Vaccinations': 'vaccination',
      'Consultations': 'consultation',
    };
    return records.filter((r) => r.type === map[activeCategory]);
  }, [records, activeCategory]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadName(file.name);
    setUploadState('uploading');
    setTimeout(() => {
      setUploadState('done');
      addRecord({
        title: file.name.replace(/\.[^/.]+$/, ''),
        hospital: 'Uploaded',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        type: 'consultation',
        status: 'normal',
        notes: `Uploaded file: ${file.name} (${(file.size / 1024).toFixed(0)} KB)`,
      });
      setTimeout(() => {
        setUploadState('idle');
        setUploadName('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
      }, 800);
    }, 2000);
  };

  const renderRecordCard = (record: MedicalRecord) => {
    const cfg = typeConfig[record.type] || typeConfig.consultation;
    const Icon = cfg.icon;
    return (
      <motion.div key={record.id} variants={itemVariants} layout>
        <GlassCard className="p-4 cursor-pointer" onClick={() => setShowDetail(record)}>
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', cfg.bg)}>
              <Icon size={18} className={cfg.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold truncate">{record.title}</h4>
                {record.status === 'normal' && (
                  <div className={cn('w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0')}>
                    <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{record.hospital} &bull; {record.date}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', cfg.bg, cfg.color)}>
                {cfg.label}
              </span>
              {record.status === 'abnormal' && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-red-500/15 text-red-700">
                  {t.abnormal}
                </span>
              )}
            </div>
            <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
          </div>
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
          <FolderHeart size={24} className="text-vita-purple" /> {t.myRecords}
        </h1>
      </motion.header>

      {/* Category Filter */}
      <motion.section className="px-5 py-3" variants={containerVariants}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm',
                activeCategory === cat
                  ? 'bg-vita-purple text-white'
                  : 'bg-white/65 dark:bg-vita-dark-surface/60 border border-white/50 dark:border-vita-dark-border text-foreground dark:text-vita-dark-text'
              )}
              onClick={() => setActiveCategory(cat)}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              {cat === 'All' ? t.all : cat}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Records List */}
      <motion.section className="px-5 py-2 space-y-3" variants={containerVariants}>
        <AnimatePresence mode="wait">
          {filtered.map(renderRecordCard)}
        </AnimatePresence>
      </motion.section>

      {/* Upload Area */}
      <motion.section className="px-5 py-4" variants={itemVariants}>
        <label
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-vita-purple/30 p-8 cursor-pointer',
            'hover:border-vita-purple/50 transition-colors'
          )}
        >
          {uploadState === 'idle' && (
            <>
              <Upload size={32} className="text-vita-purple" />
              <p className="font-medium text-foreground">{t.uploadRecord}</p>
              <p className="text-sm text-muted-foreground">{t.tapToSelect}</p>
            </>
          )}
          {uploadState === 'uploading' && (
            <>
              <p className="text-sm font-medium text-vita-purple">Uploading {uploadName}...</p>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-vita-purple rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </div>
            </>
          )}
          {uploadState === 'done' && (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-emerald-600">Upload complete!</p>
            </>
          )}
          <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={handleFileSelect} />
        </label>
      </motion.section>

      {/* Detail Sheet */}
      {showDetail && (
        <GlassSheet isOpen={!!showDetail} onClose={() => setShowDetail(null)} title={showDetail.title}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-sm text-muted-foreground">{showDetail.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{showDetail.hospital}</span>
            </div>
            {showDetail.doctor && (
              <div className="flex items-center gap-2">
                <Stethoscope size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{showDetail.doctor}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className={cn(
                'rounded-full px-3 py-1 text-xs font-bold',
                showDetail.status === 'normal' ? 'bg-emerald-500/15 text-emerald-700' : 'bg-red-500/15 text-red-700'
              )}>
                {showDetail.status === 'normal' ? t.normal : t.abnormal}
              </span>
            </div>
            <div className="bg-white/40 dark:bg-vita-dark-surfaceLight/40 rounded-xl p-3">
              <p className="text-sm text-foreground">{showDetail.notes}</p>
            </div>
            {showDetail.results && showDetail.results.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-vita-purple mb-2">Results</h4>
                <div className="space-y-2">
                  {showDetail.results.map((r) => (
                    <div key={r.name} className="flex items-center justify-between bg-white/30 dark:bg-vita-dark-surfaceLight/40 rounded-lg p-2">
                      <span className="text-xs text-muted-foreground">{r.name}</span>
                      <div className="text-right">
                        <span className={cn('text-sm font-medium', r.isAbnormal ? 'text-red-600' : 'text-foreground')}>
                          {r.value} {r.unit}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-2">({r.range})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {showDetail.attachedFiles && showDetail.attachedFiles.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-vita-purple mb-2">Attached Files</h4>
                <div className="space-y-2">
                  {showDetail.attachedFiles.map((f) => (
                    <div key={f.name} className="flex items-center gap-2 bg-white/30 dark:bg-vita-dark-surfaceLight/40 rounded-xl p-3">
                      <FileText size={16} className="text-vita-purple" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground">{f.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <GlassButton fullWidth icon={<Share2 size={14} />} onClick={() => { setShowDetail(null); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2500); }}>
              {t.shareRecord}
            </GlassButton>
          </div>
        </GlassSheet>
      )}

      <SuccessState show={showSuccess} message={t.success} />
    </motion.div>
  );
};

export default RecordsPage;

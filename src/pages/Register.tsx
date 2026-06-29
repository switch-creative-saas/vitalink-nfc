import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, HeartPulse, Phone, Shield, User } from 'lucide-react';
import { usePatientStore } from '@/store/usePatientStore';
import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGE_OPTIONS } from '@/components/ui/LanguageSwitcher';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import PinInput from '@/components/ui/PinInput';
import { cn } from '@/lib/utils';

const inputClass = 'w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm outline-none focus:border-vita-purple dark:focus:border-vita-dark-glowSoft';

export default function Register() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const updatePatient = usePatientStore((s) => s.updatePatient);
  const addContact = usePatientStore((s) => s.addContact);
  const registerCard = usePatientStore((s) => s.registerCard);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    bloodType: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const handleNext = () => {
    setError('');
    setStep((s) => Math.min(3, s + 1));
  };
  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  };

  const handleComplete = () => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError(t.pinMustBeFourDigits ?? 'PIN must be exactly 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError(t.pinsDoNotMatch ?? 'PINs do not match. Please try again.');
      setConfirmPin('');
      return;
    }

    updatePatient({
      firstName: form.firstName || 'VitaLink',
      lastName: form.lastName || 'Member',
      dateOfBirth: form.dateOfBirth,
      bloodType: form.bloodType,
    });

    if (form.emergencyContactName.trim() || form.emergencyContactPhone.trim()) {
      addContact({
        name: form.emergencyContactName || 'Emergency Contact',
        relationship: 'Emergency Contact',
        phone: form.emergencyContactPhone,
        isPrimary: true,
        type: 'family',
      });
    }

    registerCard(pin);
    navigate('/emergency');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse size={22} className="text-vita-purple" />
            <span className="text-lg font-semibold">{t.appName}</span>
          </div>
          {step > 0 && (
            <GlassButton size="sm" className="text-xs" onClick={handleBack}>
              <ChevronLeft size={16} /> {t.back}
            </GlassButton>
          )}
        </div>

        <GlassCard className="p-6">
          <div className="mb-6 flex gap-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className={cn(
                  'h-2 flex-1 rounded-full transition-colors',
                  item <= step ? 'bg-vita-purple dark:bg-vita-dark-glow' : 'bg-white/50 dark:bg-vita-dark-surfaceLight/55',
                )}
              />
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t.chooseYourLanguage}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t.chooseLanguageDesc}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setLanguage(opt.code)}
                    className={cn(
                      'min-h-20 flex flex-col items-start justify-between p-4 rounded-2xl border-2 transition-all',
                      language === opt.code
                        ? 'border-vita-purple bg-vita-purple/10'
                        : 'border-white/50 dark:border-vita-dark-border bg-white/35 dark:bg-vita-dark-surfaceLight/40 hover:border-vita-purple/40',
                    )}
                  >
                    <span className="font-semibold">{opt.nativeLabel}</span>
                    <span className="flex w-full items-center justify-between gap-2 text-xs text-muted-foreground">
                      {opt.label}
                      {language === opt.code && <Check size={14} className="text-vita-purple" />}
                    </span>
                  </button>
                ))}
              </div>
              <GlassButton variant="primary" fullWidth className="h-12" onClick={handleNext}>
                {t.continue}
              </GlassButton>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-vita-purple/15 flex items-center justify-center">
                  <User size={20} className="text-vita-purple" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t.personalInformation}</h1>
                  <p className="text-sm text-muted-foreground">{t.registrationPersonalDesc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder={t.firstName} />
                <input className={inputClass} value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder={t.lastName} />
              </div>
              <input className={inputClass} value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} placeholder={t.dateOfBirth} />
              <select className={inputClass} value={form.bloodType} onChange={(e) => updateField('bloodType', e.target.value)}>
                <option value="">{t.bloodType}</option>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <GlassButton variant="primary" fullWidth className="h-12" onClick={handleNext}>
                {t.next}
              </GlassButton>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-red-500/15 flex items-center justify-center">
                  <Phone size={20} className="text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t.emergencyContact}</h1>
                  <p className="text-sm text-muted-foreground">{t.registrationEmergencyDesc}</p>
                </div>
              </div>
              <input className={inputClass} value={form.emergencyContactName} onChange={(e) => updateField('emergencyContactName', e.target.value)} placeholder={t.contactName} />
              <input className={inputClass} value={form.emergencyContactPhone} onChange={(e) => updateField('emergencyContactPhone', e.target.value)} placeholder="+234" type="tel" />
              <div className="flex gap-3">
                <GlassButton fullWidth className="h-12" onClick={handleBack}>
                  {t.back}
                </GlassButton>
                <GlassButton variant="primary" fullWidth className="h-12" onClick={handleNext}>
                  {t.next}
                </GlassButton>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-vita-purple/15 flex items-center justify-center">
                  <Shield size={20} className="text-vita-purple" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t.setPin}</h1>
                  <p className="text-sm text-muted-foreground">{t.setPinDesc}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">{t.pin}</label>
                <PinInput value={pin} onChange={(value) => { setPin(value); setError(''); }} hasError={!!error} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">{t.confirmPin}</label>
                <PinInput value={confirmPin} onChange={(value) => { setConfirmPin(value); setError(''); }} hasError={!!error} />
              </div>
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <div className="flex gap-3">
                <GlassButton fullWidth className="h-12" onClick={handleBack}>
                  {t.back}
                </GlassButton>
                <GlassButton variant="primary" fullWidth className="h-12" onClick={handleComplete}>
                  {t.completeSetup}
                </GlassButton>
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}

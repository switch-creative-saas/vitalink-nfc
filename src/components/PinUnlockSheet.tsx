import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { usePatientStore } from '@/store/usePatientStore';
import { useLanguage } from '@/context/LanguageContext';
import GlassSheet from '@/components/ui/GlassSheet';
import GlassButton from '@/components/ui/GlassButton';
import PinInput from '@/components/ui/PinInput';

interface PinUnlockSheetProps {
  onClose: () => void;
}

export default function PinUnlockSheet({ onClose }: PinUnlockSheetProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const unlockWithPin = usePatientStore((s) => s.unlockWithPin);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const success = unlockWithPin(pin);
    if (success) {
      onClose();
      navigate('/');
      return;
    }
    setError(true);
    setPin('');
  };

  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <GlassSheet isOpen onClose={onClose} title={t.enterYourPin}>
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-vita-purple/15 flex items-center justify-center flex-shrink-0">
            <Lock size={20} className="text-vita-purple" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {t.unlockFullAccess}
            </p>
            {error && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {t.incorrectPin}
              </p>
            )}
          </div>
        </div>

        <PinInput
          value={pin}
          onChange={(value) => {
            setPin(value);
            setError(false);
          }}
          hasError={error}
          autoFocus
        />

        <GlassButton variant="primary" fullWidth className="h-12" onClick={handleSubmit}>
          {t.unlock}
        </GlassButton>

        <button
          type="button"
          className="w-full text-center text-sm font-medium text-vita-purple"
          onClick={() => window.alert(t.contactSupportResetPin)}
        >
          {t.forgotPin}
        </button>
      </div>
    </GlassSheet>
  );
}

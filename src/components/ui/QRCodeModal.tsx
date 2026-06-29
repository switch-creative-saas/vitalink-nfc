import React from 'react';
import ReactQRCode from 'react-qr-code';
import GlassSheet from './GlassSheet';
import { HeartPulse } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, value }) => {
  return (
    <GlassSheet isOpen={isOpen} onClose={onClose} title="Medical Access QR">
      <div className="flex flex-col items-center py-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <ReactQRCode
            value={value}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="M"
          />
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Scan to access medical information
        </p>
        <p className="text-xs text-muted-foreground font-mono mt-1">{value}</p>
        <div className="flex items-center gap-1.5 mt-6 text-xs text-muted-foreground">
          <HeartPulse size={12} className="text-vita-purple" />
          <span>Powered by VitaLink</span>
        </div>
      </div>
    </GlassSheet>
  );
};

export default QRCodeModal;

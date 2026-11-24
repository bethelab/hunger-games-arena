import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, PlusCircle, RefreshCw, Monitor, Copy, Check } from 'lucide-react';
import { sound } from './SoundEffects';

export default function PresenterModal({ isOpen, onClose, onSimulateJoin, onResetArena, tributeCount }) {
  const [qrUrl, setQrUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      setCurrentUrl(url);
      QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#3B0764',
          light: '#FFF7ED'
        }
      })
      .then(dataUrl => setQrUrl(dataUrl))
      .catch(err => console.error("QR Code generation error:", err));
    }
  }, [isOpen]);

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-purple-200 p-6 sm:p-8 text-purple-950 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-50 text-purple-700 hover:text-purple-950 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-bold font-cinzel text-purple-950">
            Presenter Slide & Control Center
          </h3>
        </div>

        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center bg-orange-50/60 p-6 rounded-2xl border-2 border-orange-200 mb-6">
          <div className="text-xs uppercase font-mono-capitol tracking-wider text-orange-700 font-bold mb-3 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-orange-600" />
            Put This QR Code on Your Slide / Screen
          </div>

          {qrUrl ? (
            <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-orange-300">
              <img src={qrUrl} alt="Presentation Join QR Code" className="w-44 h-44 rounded-xl" />
            </div>
          ) : (
            <div className="w-44 h-44 flex items-center justify-center bg-purple-50 rounded-2xl text-xs text-purple-400">
              Generating QR Code...
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 w-full max-w-sm">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-2 text-xs bg-white border border-purple-200 rounded-xl text-purple-900 font-mono select-all truncate shadow-inner"
            />
            <button
              onClick={handleCopyUrl}
              className="px-3.5 py-2 text-xs bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-90 text-white font-bold rounded-xl transition-all flex items-center gap-1 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[11px] text-purple-700 mt-2 text-center font-medium">
            Team members scan with their phone camera to create their tribute emoji and enter the arena!
          </p>
        </div>

        {/* Live Presentation Demo Tools */}
        <div className="space-y-3">
          <div className="text-xs uppercase font-mono-capitol tracking-wider text-purple-700 font-bold">
            Live Presentation Simulation Controls
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onSimulateJoin();
                sound.playPedestalRise();
              }}
              className="p-3 rounded-xl bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-900 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4 text-orange-600" />
              <span>Simulate Tribute Join</span>
            </button>

            <button
              onClick={() => {
                if (confirm("Reset arena tribute roster?")) {
                  onResetArena();
                  sound.playCannon();
                }
              }}
              className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <RefreshCw className="w-4 h-4 text-rose-600" />
              <span>Reset Arena Roster</span>
            </button>
          </div>

          <div className="text-xs text-purple-700 bg-purple-50 p-3 rounded-xl border border-purple-200 flex items-center justify-between font-mono-capitol">
            <span>Tributes currently placed in arena:</span>
            <span className="font-extrabold text-orange-600 text-sm">{tributeCount} / 24</span>
          </div>
        </div>
      </div>
    </div>
  );
}

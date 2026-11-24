import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { syncService } from '../services/syncService';
import { sound } from './SoundEffects';
import { DISTRICTS, GAME_EDITION } from '../data/hungerGamesData';
import { Play, Pause, RotateCcw, Volume2, Users, RefreshCw, QrCode, ExternalLink, Shield } from 'lucide-react';

export default function HostController({ onNavigate }) {
  const [tributes, setTributes] = useState([]);
  const [timer, setTimer] = useState({ running: false, countdown: 60 });
  const [qrUrl, setQrUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    document.title = "Host Controller | The Hunger Games";

    const unsubscribe = syncService.subscribe(
      (updatedTributes) => setTributes(updatedTributes),
      (updatedTimer) => setTimer(updatedTimer)
    );

    if (typeof window !== 'undefined') {
      const joinUrl = window.location.origin + window.location.pathname + '#/reaping';
      setCurrentUrl(joinUrl);
      QRCode.toDataURL(joinUrl, {
        width: 260,
        margin: 2,
        color: { dark: '#3B0764', light: '#FFF7ED' }
      }).then(url => setQrUrl(url)).catch(() => {});
    }

    return () => unsubscribe();
  }, []);

  const handleStartTimer = () => {
    sound.playBeep();
    syncService.controlTimer('start');
  };

  const handlePauseTimer = () => {
    sound.playBeep();
    syncService.controlTimer('pause');
  };

  const handleResetTimer = (seconds = 60) => {
    sound.playBeep();
    syncService.controlTimer('reset', seconds);
  };

  const handleFireCannon = () => {
    sound.playCannon();
  };

  const handleResetArena = () => {
    if (confirm("Reset the arena? This clears all tributes and resets the countdown.")) {
      sound.playCannon();
      syncService.controlTimer('reset_arena');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5FF] text-purple-950 p-4 sm:p-8 reaping-sun-glow">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-purple-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-1 font-mono-capitol">
              Game Master Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-purple-950 font-cinzel">
              The {GAME_EDITION} Hunger Games • Host Controller
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('arena')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold shadow-sm hover:bg-purple-950 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Arena View</span>
            </button>
          </div>
        </header>

        {/* Top Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 60-Second Countdown Controller */}
          <div className="bg-white rounded-2xl p-6 retro-border-light shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono-capitol font-bold text-orange-600 tracking-wider">
                Arena Gong Countdown
              </span>
              <h2 className="text-lg font-black text-purple-950 font-cinzel mb-3">
                Live Timer Control
              </h2>

              {/* Big Timer Display */}
              <div className="text-center py-6 bg-purple-50 rounded-2xl border-2 border-purple-200 mb-4 shadow-inner">
                <span className={`text-5xl sm:text-6xl font-black font-mono tracking-widest ${
                  timer.countdown <= 10 && timer.countdown > 0 ? 'text-orange-600 animate-pulse' : 'text-purple-900'
                }`}>
                  00:{timer.countdown.toString().padStart(2, '0')}
                </span>
                <p className="text-xs text-purple-600 font-mono-capitol mt-1 font-bold">
                  Status: {timer.running ? "RUNNING (Synced to all players)" : "PAUSED"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                {!timer.running ? (
                  <button
                    onClick={handleStartTimer}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-purple-800 text-white font-bold rounded-xl shadow-md hover:opacity-90 flex items-center justify-center gap-2 text-sm"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Countdown</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTimer}
                    className="flex-1 py-3 bg-purple-200 text-purple-950 font-bold rounded-xl hover:bg-purple-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause Countdown</span>
                  </button>
                )}

                <button
                  onClick={() => handleResetTimer(60)}
                  className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  title="Reset to 60s"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset 60s</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFireCannon}
                  className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4 text-orange-600" />
                  <span>Test Cannon Boom</span>
                </button>

                <button
                  onClick={handleResetArena}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Reset Arena</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Presentation QR Code */}
          <div className="bg-white rounded-2xl p-6 retro-border-light shadow-xl flex flex-col items-center justify-between text-center">
            <div>
              <span className="text-[10px] uppercase font-mono-capitol font-bold text-orange-600 tracking-wider">
                Slide Presentation
              </span>
              <h2 className="text-lg font-black text-purple-950 font-cinzel mb-2">
                Scan to Join as Tribute
              </h2>
              <p className="text-xs text-purple-700 mb-3">
                Show this on your screen for team members to join on their phones!
              </p>
            </div>

            {qrUrl ? (
              <div className="p-2.5 bg-white rounded-2xl border-2 border-orange-300 shadow-md">
                <img src={qrUrl} alt="Join QR Code" className="w-36 h-36 rounded-xl" />
              </div>
            ) : null}

            <div className="mt-3 text-[11px] font-mono text-purple-700 select-all bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 w-full truncate">
              {currentUrl}
            </div>
          </div>
        </div>

        {/* Live Tribute Roster (Pedestals 1-12) */}
        <div className="bg-white rounded-2xl p-6 retro-border-light shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-black font-cinzel text-purple-950">
                Connected Tributes ({tributes.length} / 12)
              </h3>
            </div>
            <span className="text-xs font-mono-capitol font-bold text-orange-600">
              Assigned strictly in arrival order (Pedestals 1 to 12)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 12 }, (_, i) => {
              const num = i + 1;
              const tribute = tributes.find(t => t.pedestalNumber === num);
              const dist = tribute ? (DISTRICTS.find(d => d.id === tribute.districtId) || DISTRICTS[0]) : null;

              return (
                <div
                  key={num}
                  className={`p-3 rounded-xl border flex flex-col justify-between min-h-[90px] ${
                    tribute 
                      ? 'bg-purple-50/80 border-purple-300 shadow-sm' 
                      : 'bg-purple-50/20 border-dashed border-purple-200 text-purple-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-capitol font-bold">
                    <span className={tribute ? 'text-orange-600' : 'text-purple-400'}>Pedestal #{num}</span>
                    {tribute ? <span className="text-emerald-600 font-bold">READY</span> : <span>OPEN</span>}
                  </div>

                  {tribute ? (
                    <div className="my-1">
                      <div className="text-xs font-black text-purple-950 truncate">{tribute.realName}</div>
                      <div className="text-[10px] text-purple-700 truncate">{dist?.name}: {dist?.specialty}</div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-purple-300 italic my-auto">Waiting for tribute...</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

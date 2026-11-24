import React, { useState } from 'react';
import { DISTRICTS, getRandomDistrict, GAME_EDITION } from '../data/hungerGamesData';
import { sound } from './SoundEffects';
import { Sparkles, ArrowRight, ArrowLeft, Shuffle, Shield, Crown } from 'lucide-react';

export default function ReapingScreen({ onComplete, initialData }) {
  // Sub-steps: 1 = Role & Name Input, 2 = District Drawing, 3 = Confirmation
  const [subStep, setSubStep] = useState(1);
  const [role, setRole] = useState(initialData?.role || 'tribute'); // 'tribute' | 'gamemaker'
  const [realName, setRealName] = useState(initialData?.realName || '');
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    return initialData?.districtId 
      ? DISTRICTS.find(d => d.id === initialData.districtId) || DISTRICTS[0]
      : getRandomDistrict();
  });
  const [isSpinning, setIsSpinning] = useState(false);

  // Phase 1 -> Phase 2
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!realName.trim()) {
      alert("Please enter your name!");
      return;
    }
    sound.playBeep(true);
    setSubStep(2);
  };

  // Phase 2: Spin / Randomly Draw District
  const handleDrawRandomDistrict = () => {
    setIsSpinning(true);
    sound.playPedestalRise();

    let counter = 0;
    const interval = setInterval(() => {
      const tempDist = getRandomDistrict();
      setSelectedDistrict(tempDist);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        const finalDist = getRandomDistrict();
        setSelectedDistrict(finalDist);
        setIsSpinning(false);
        sound.playFanfare();
      }
    }, 90);
  };

  // Phase 2 -> Phase 3
  const handleProceedToConfirmation = () => {
    sound.playBeep(true);
    setSubStep(3);
  };

  // Final Submit -> Stylist Room
  const handleFinalSubmit = () => {
    sound.playFanfare();
    onComplete({
      realName: realName.trim(),
      alias: realName.trim(),
      role: role, // 'tribute' or 'gamemaker'
      districtId: selectedDistrict.id,
      motto: selectedDistrict.motto
    });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF5FF] text-purple-950 flex flex-col justify-between p-4 sm:p-8 reaping-sun-glow overflow-hidden">
      {/* Accent top stripe */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-800 via-orange-500 to-purple-800" />

      {/* Main Container */}
      <main className="relative z-10 max-w-lg mx-auto w-full my-auto">
        {/* Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Foxarians on the Reaping
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-purple-700 to-orange-600 uppercase tracking-wide font-cinzel">
            The Hunger Games
          </h1>

          {/* Simple Step Progress */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className={`flex items-center gap-1.5 text-xs font-bold ${subStep >= 1 ? 'text-purple-900 font-extrabold' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                subStep === 1 ? 'bg-orange-500 text-white' : subStep > 1 ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-600'
              }`}>1</span>
              <span>{role === 'gamemaker' ? 'Gamemaker' : 'Tribute'}</span>
            </div>
            <div className="w-6 h-0.5 bg-purple-200" />
            <div className={`flex items-center gap-1.5 text-xs font-bold ${subStep >= 2 ? 'text-purple-900 font-extrabold' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                subStep === 2 ? 'bg-orange-500 text-white' : subStep > 2 ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-600'
              }`}>2</span>
              <span>District Draw</span>
            </div>
            <div className="w-6 h-0.5 bg-purple-200" />
            <div className={`flex items-center gap-1.5 text-xs font-bold ${subStep >= 3 ? 'text-purple-900 font-extrabold' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                subStep === 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>3</span>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        {/* ================= STEP 1: ROLE SELECTION & NAME INPUT ================= */}
        {subStep === 1 && (
          <form onSubmit={handleNameSubmit} className="bg-white rounded-2xl p-6 sm:p-8 retro-border-light shadow-xl">
            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-purple-900 font-cinzel">
                Step Forward
              </h2>
              <p className="text-xs text-purple-700 mt-1">
                Choose your role and enter your name
              </p>
            </div>

            <div className="space-y-5">
              {/* Role Toggle: Compact inline next to "Select Your Role" */}
              <div className="flex items-center justify-between pb-1 border-b border-purple-100">
                <label className="text-xs uppercase font-bold tracking-wider text-purple-900 font-mono-capitol">
                  Select Your Role
                </label>
                <div className="flex items-center gap-1.5 p-1 bg-purple-100/70 rounded-xl border border-purple-200">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('tribute');
                      sound.playBeep();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      role === 'tribute'
                        ? 'bg-orange-500 text-white shadow-sm font-black'
                        : 'text-purple-700 hover:text-purple-950'
                    }`}
                  >
                    <span>🏹</span>
                    <span>Tribute</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('gamemaker');
                      sound.playBeep(true);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      role === 'gamemaker'
                        ? 'bg-purple-900 text-white shadow-sm font-black'
                        : 'text-purple-700 hover:text-purple-950'
                    }`}
                  >
                    <span>👑</span>
                    <span>Gamemaker</span>
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-purple-900 mb-1.5 font-mono-capitol">
                  Name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder={role === 'gamemaker' ? "e.g. Host Alex, Organizer..." : "e.g. Alex, Jordan..."}
                  className="w-full px-4 py-3.5 rounded-xl bg-purple-50/60 border-2 border-purple-200 focus:border-orange-500 focus:bg-white text-purple-950 placeholder-purple-400 text-base font-semibold outline-none transition-all shadow-inner"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-800 via-purple-700 to-orange-600 hover:from-purple-900 hover:to-orange-700 text-white font-black uppercase tracking-wider text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 font-cinzel"
              >
                <span>{role === 'gamemaker' ? "Know My District" : "Know My District"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 2: RANDOM DISTRICT DRAW ================= */}
        {subStep === 2 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 retro-border-light shadow-xl">
            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-purple-900 font-cinzel">
                The Reaping Bowl
              </h2>
              <p className="text-xs text-purple-700 mt-1">
                Spin to draw your Panem district!
              </p>
            </div>

            {/* Drawing Sphere & Result */}
            <div className="flex flex-col items-center my-3">
              <button
                type="button"
                onClick={handleDrawRandomDistrict}
                disabled={isSpinning}
                className={`w-24 h-24 rounded-full border-4 border-orange-500 bg-gradient-to-tr from-purple-900 via-purple-700 to-orange-500 flex flex-col items-center justify-center text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 mb-4 ${
                  isSpinning ? 'animate-spin' : ''
                }`}
                title="Click to spin and redraw"
              >
                <span className="text-2xl mb-0.5">{selectedDistrict.icon}</span>
                <span className="text-[9px] font-mono-capitol uppercase tracking-wider font-extrabold text-orange-200">
                  {isSpinning ? 'Drawing...' : 'Spin'}
                </span>
              </button>

              {/* District Card */}
              <div className="w-full p-4 rounded-xl bg-purple-50 border-2 border-purple-200 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedDistrict.icon}</span>
                    <span className="text-base font-black text-purple-950 font-cinzel">
                      {selectedDistrict.name}: {selectedDistrict.specialty}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-capitol px-2 py-0.5 rounded-full bg-purple-200 text-purple-800 font-bold">
                    #{selectedDistrict.id}
                  </span>
                </div>

                <div className="pt-2 border-t border-purple-200 flex items-center justify-between">
                  <span className="text-xs text-orange-700 italic font-medium">
                    "{selectedDistrict.motto}"
                  </span>
                  <button
                    type="button"
                    onClick={handleDrawRandomDistrict}
                    disabled={isSpinning}
                    className="inline-flex items-center gap-1 text-xs text-purple-700 hover:text-orange-600 font-bold hover:underline"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Spin Again</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSubStep(1)}
                className="px-4 py-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToConfirmation}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-800 to-orange-600 hover:from-purple-900 hover:to-orange-700 text-white font-black uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 font-cinzel"
              >
                <span>Confirm District</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: TRIBUTE CONFIRMATION ================= */}
        {subStep === 3 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 retro-border-light shadow-xl">
            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-purple-900 font-cinzel">
                {role === 'gamemaker' ? 'Gamemaker Profile' : 'Tribute Profile'}
              </h2>
            </div>

            {/* Profile Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600 text-white shadow-xl mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl sm:text-3xl font-black text-white font-cinzel tracking-wider">
                  {realName}
                </span>
                <span className="text-[10px] uppercase font-mono-capitol font-bold px-2 py-0.5 rounded-full bg-white/20 text-orange-200 border border-white/20">
                  {role === 'gamemaker' ? '👑 Head Gamemaker' : '🏹 Tribute'}
                </span>
              </div>

              <div className="text-xs text-orange-200 font-mono-capitol mt-2 flex items-center gap-2 font-bold">
                <span>{selectedDistrict.icon} {selectedDistrict.name} (#{selectedDistrict.id})</span>
                <span>•</span>
                <span>{selectedDistrict.specialty}</span>
              </div>

              <div className="text-xs text-purple-100 italic mt-3 pt-2.5 border-t border-purple-400/40">
                "{selectedDistrict.motto}"
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSubStep(2)}
                className="px-4 py-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-purple-800 hover:from-orange-600 hover:to-purple-900 text-white font-black uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 shadow-xl flex items-center justify-center gap-2 font-cinzel"
              >
                <span>Proceed to Stylist Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

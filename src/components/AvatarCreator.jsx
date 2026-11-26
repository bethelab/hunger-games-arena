import React, { useState } from 'react';
import AvatarRenderer from './AvatarRenderer';
import { AVATAR_PRESETS, DISTRICTS } from '../data/hungerGamesData';
import { sound } from './SoundEffects';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function AvatarCreator({ tributeData, onComplete, onBack }) {
  const [selectedPresetId, setSelectedPresetId] = useState("preset-1");
  const [avatar, setAvatar] = useState(tributeData?.avatar || AVATAR_PRESETS[0].avatar);

  const district = DISTRICTS.find(d => d.id === tributeData?.districtId) || DISTRICTS[0];

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setAvatar(preset.avatar);
    sound.playBeep();
  };

  const handleConfirm = () => {
    sound.playPedestalRise();
    onComplete({
      ...tributeData,
      avatar
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 bg-[#FAF5FF] text-purple-950 relative overflow-hidden reaping-sun-glow">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-800 via-orange-500 to-purple-800" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-xl bg-white border border-purple-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-800 via-purple-600 to-orange-500 font-cinzel drop-shadow-sm">
            Tribute Stylist Studio
          </h2>
          <p className="text-xs text-purple-700 font-mono-capitol font-semibold mt-0.5">
            Select your avatar
          </p>
        </div>

        <div className="w-16" /> {/* Spacer */}
      </header>

      {/* Main Stylist Stage */}
      {/* Main Stylist Stage - Both boxes equal 50/50 size */}
      <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch flex-1 my-auto">
        {/* Left Column: Live Chosen Avatar Preview (Box 1) */}
        <div className="flex flex-col justify-between items-center p-6 bg-white rounded-2xl retro-border-light shadow-xl">
          <div className="text-center w-full">
            <span className="text-[11px] text-purple-600 uppercase font-mono-capitol font-bold">Assigned District</span>
            <div className="text-base font-black text-purple-950 font-cinzel">
              {district.icon} {district.name}: {district.specialty}
            </div>
          </div>

          {/* Avatar Render */}
          <div className="py-4 scale-110 my-auto">
            <AvatarRenderer avatar={avatar} districtId={tributeData?.districtId || 1} size="lg" showPedestal={true} animated={true} />
          </div>

          {/* Tribute Name Card */}
          <div className="text-center w-full px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-200">
            <div className="text-[10px] uppercase font-mono-capitol text-purple-700 font-extrabold tracking-wider">Tribute Name</div>
            <div className="text-lg font-black text-purple-950 font-cinzel truncate">{tributeData?.realName || "Tribute"}</div>
          </div>
        </div>

        {/* Right Column: 12 Avatar Choices in 4x3 Grid (Box 2 - Equal Size) */}
        <div className="flex flex-col justify-between p-6 bg-white rounded-2xl retro-border-light shadow-xl">
          <div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {AVATAR_PRESETS.map((preset) => {
                const isSel = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2 sm:p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all text-center relative ${
                      isSel
                        ? 'bg-purple-100 border-purple-800 shadow-md ring-2 ring-orange-500/50 scale-102'
                        : 'bg-purple-50/50 border-purple-200 text-purple-800 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {isSel && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}

                    <div className="w-12 h-12 flex items-center justify-center">
                      <AvatarRenderer avatar={preset.avatar} districtId={tributeData?.districtId || 1} size="sm" />
                    </div>
                    <span className="text-[11px] font-bold text-purple-950 truncate w-full">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-4 border-t border-purple-100 mt-4">
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-800 via-purple-700 to-orange-600 hover:from-purple-900 hover:to-orange-700 text-white font-black uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 font-cinzel"
            >
              <span>Confirm Look & Enter The Arena</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

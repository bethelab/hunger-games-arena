import React from 'react';
import { AVATAR_OPTIONS, DISTRICTS } from '../data/hungerGamesData';

export default function AvatarRenderer({ avatar, districtId = 12, size = "md", showPedestal = false, animated = false }) {
  const {
    gender = "female",
    skinTone = "medium",
    hairStyle = "ponytail",
    hairColor = "black",
    expression = "fierce",
    outfit = "jumpsuit",
    accessory = "pin"
  } = avatar || {};

  // Resolve colors with safe fallbacks
  const skin = AVATAR_OPTIONS.skinTones?.find(s => s.id === skinTone)?.color || "#D97706";
  const hair = AVATAR_OPTIONS.hairColors?.find(h => h.id === hairColor)?.color || "#18181B";
  const outfitData = AVATAR_OPTIONS.outfits?.find(o => o.id === outfit) || { color: "#4C1D95", accent: "#F97316" };
  const district = DISTRICTS.find(d => d.id === districtId) || DISTRICTS[0];

  // Size configurations
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-40 h-40",
    xl: "w-64 h-64"
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative flex flex-col items-center justify-center ${showPedestal ? 'pt-2 pb-6' : ''}`}>
      {/* Spotlight beam if pedestal is enabled */}
      {showPedestal && (
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent rounded-full filter blur-md pointer-events-none -bottom-3" />
      )}

      {/* Main SVG Avatar */}
      <div className={`relative ${currentSizeClass} ${animated ? 'transition-all duration-300 transform hover:scale-105' : ''}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`glow-${skinTone}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`outfit-grad-${outfit}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={outfitData.color} />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
          </defs>

          {/* Ambient Glow */}
          <circle cx="100" cy="100" r="95" fill={`url(#glow-${skinTone})`} />

          {/* District Color Back Ring */}
          <circle cx="100" cy="100" r="88" fill="none" stroke={district.color} strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />

          {/* Body / Torso / Outfit */}
          <path
            d="M 50 185 Q 50 135 100 135 Q 150 135 150 185 Z"
            fill={`url(#outfit-grad-${outfit})`}
            stroke={outfitData.accent}
            strokeWidth="2.5"
          />

          {/* Collar / Jumpsuit Zip / District Badge */}
          <path d="M 90 138 L 100 160 L 110 138 Z" fill="#1F2937" stroke={outfitData.accent} strokeWidth="1.5" />
          <line x1="100" y1="160" x2="100" y2="185" stroke={outfitData.accent} strokeWidth="2" strokeDasharray="3 2" />

          {/* Shoulders Combat Plates for Armor outfit */}
          {outfit === "armor" && (
            <>
              <path d="M 45 150 Q 55 135 70 145 L 60 170 Z" fill="#4B5563" stroke="#9CA3AF" strokeWidth="1.5" />
              <path d="M 155 150 Q 145 135 130 145 L 140 170 Z" fill="#4B5563" stroke="#9CA3AF" strokeWidth="1.5" />
            </>
          )}

          {/* Cloak Flames for Girl on Fire Cloak */}
          {outfit === "cloak" && (
            <>
              <path d="M 48 185 Q 35 155 50 140 Q 60 150 55 185 Z" fill="#DC2626" opacity="0.8" />
              <path d="M 152 185 Q 165 155 150 140 Q 140 150 145 185 Z" fill="#EA580C" opacity="0.8" />
            </>
          )}

          {/* Neck */}
          <rect x="88" y="112" width="24" height="28" rx="4" fill={skin} stroke="#1F2937" strokeWidth="1" />

          {/* Head */}
          <ellipse cx="100" cy="85" rx="42" ry="48" fill={skin} stroke="#1F2937" strokeWidth="2" />

          {/* Ears */}
          <circle cx="56" cy="88" r="8" fill={skin} stroke="#1F2937" strokeWidth="1" />
          <circle cx="144" cy="88" r="8" fill={skin} stroke="#1F2937" strokeWidth="1" />

          {/* Eyes & Brows based on Expression */}
          {/* Eyebrows */}
          {expression === "fierce" && (
            <>
              <line x1="75" y1="68" x2="94" y2="76" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="125" y1="68" x2="106" y2="76" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}
          {expression === "smirk" && (
            <>
              <line x1="75" y1="72" x2="94" y2="72" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
              <path d="M 106 74 Q 116 66 126 71" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          )}
          {expression === "calm" && (
            <>
              <line x1="75" y1="72" x2="94" y2="72" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
              <line x1="106" y1="72" x2="125" y2="72" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          {(expression === "intense" || expression === "smile") && (
            <>
              <path d="M 75 73 Q 85 68 95 72" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 105 72 Q 115 68 125 73" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Eyes */}
          <ellipse cx="85" cy="82" rx="6" ry={expression === "intense" ? "7" : "5"} fill="#18181B" />
          <ellipse cx="115" cy="82" rx="6" ry={expression === "intense" ? "7" : "5"} fill="#18181B" />
          {/* Eye catchlight */}
          <circle cx="87" cy="80" r="2" fill="#FFFFFF" />
          <circle cx="117" cy="80" r="2" fill="#FFFFFF" />

          {/* Nose */}
          <path d="M 98 84 L 102 94 L 96 95" stroke="#9A3412" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Mouth */}
          {expression === "fierce" && (
            <line x1="88" y1="108" x2="112" y2="108" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
          )}
          {expression === "smirk" && (
            <path d="M 88 108 Q 102 108 114 103" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
          )}
          {expression === "calm" && (
            <line x1="90" y1="107" x2="110" y2="107" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
          )}
          {expression === "intense" && (
            <ellipse cx="100" cy="108" rx="8" ry="4" fill="#18181B" />
          )}
          {expression === "smile" && (
            <path d="M 88 104 Q 100 114 112 104" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
          )}

          {/* War Paint Accessory */}
          {accessory === "warpaint" && (
            <>
              <line x1="68" y1="88" x2="80" y2="92" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
              <line x1="68" y1="94" x2="82" y2="98" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
              <line x1="132" y1="88" x2="120" y2="92" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
              <line x1="132" y1="94" x2="118" y2="98" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {/* Holo Goggles Accessory */}
          {accessory === "goggles" && (
            <g>
              <rect x="70" y="74" width="60" height="16" rx="6" fill="#0284C7" fillOpacity="0.75" stroke="#38BDF8" strokeWidth="2" />
              <line x1="56" y1="82" x2="70" y2="82" stroke="#0F172A" strokeWidth="3" />
              <line x1="130" y1="82" x2="144" y2="82" stroke="#0F172A" strokeWidth="3" />
              <line x1="76" y1="78" x2="92" y2="78" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" />
            </g>
          )}

          {/* Hair Styles */}
          {hairStyle === "buzz" && (
            <path d="M 60 70 Q 100 35 140 70 Q 142 50 100 42 Q 58 50 60 70 Z" fill={hair} />
          )}

          {hairStyle === "ponytail" && (
            <>
              {/* Main hair body */}
              <path d="M 58 75 Q 100 30 142 75 Q 146 55 100 40 Q 54 55 58 75 Z" fill={hair} />
              {/* Ponytail extension */}
              <path d="M 135 60 Q 165 65 170 110 Q 155 115 140 75 Z" fill={hair} />
              <circle cx="137" cy="63" r="5" fill="#D4AF37" />
            </>
          )}

          {hairStyle === "spikes" && (
            <path d="M 58 70 L 65 35 L 78 50 L 88 25 L 100 45 L 112 25 L 122 50 L 135 35 L 142 70 Q 100 50 58 70 Z" fill={hair} />
          )}

          {hairStyle === "dreads" && (
            <>
              <path d="M 58 75 Q 100 30 142 75 Q 146 45 100 40 Q 54 45 58 75 Z" fill={hair} />
              {/* Hanging strands */}
              <rect x="52" y="70" width="8" height="55" rx="4" fill={hair} transform="rotate(8 52 70)" />
              <rect x="62" y="65" width="8" height="60" rx="4" fill={hair} transform="rotate(4 62 65)" />
              <rect x="130" y="65" width="8" height="60" rx="4" fill={hair} transform="rotate(-4 130 65)" />
              <rect x="140" y="70" width="8" height="55" rx="4" fill={hair} transform="rotate(-8 140 70)" />
            </>
          )}

          {hairStyle === "bob" && (
            <path d="M 55 75 Q 100 35 145 75 L 148 115 Q 138 120 135 95 Q 100 65 65 95 Q 62 120 52 115 Z" fill={hair} />
          )}

          {hairStyle === "wild" && (
            <path d="M 50 85 Q 40 45 75 35 Q 100 20 125 35 Q 160 45 150 85 Q 160 115 145 125 Q 135 90 100 65 Q 65 90 55 125 Q 40 115 50 85 Z" fill={hair} />
          )}

          {hairStyle === "mohawk" && (
            <path d="M 88 80 L 88 20 Q 100 15 112 20 L 112 80 Z" fill={hair} />
          )}

          {hairStyle === "hooded" && (
            <path d="M 50 110 Q 50 35 100 35 Q 150 35 150 110 Q 160 140 145 155 Q 130 95 100 70 Q 70 95 55 155 Q 40 140 50 110 Z" fill="#1F2937" stroke="#D4AF37" strokeWidth="1.5" />
          )}

          {/* Pinned Accessories */}
          {accessory === "pin" && (
            <g transform="translate(118, 142)">
              <circle cx="10" cy="10" r="10" fill="#F59E0B" stroke="#D4AF37" strokeWidth="2" />
              {/* Mockingjay silhouette */}
              <path d="M 4 10 Q 8 6 12 10 Q 16 14 10 16 Q 6 14 4 10 Z" fill="#78350F" />
              <line x1="3" y1="17" x2="17" y2="3" stroke="#FEF3C7" strokeWidth="1.5" />
            </g>
          )}

          {accessory === "bow" && (
            <g transform="translate(138, 110) rotate(25)">
              <path d="M 0 0 Q -15 35 0 70" stroke="#78350F" strokeWidth="4" fill="none" />
              <line x1="0" y1="0" x2="0" y2="70" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="2 1" />
            </g>
          )}

          {accessory === "trident" && (
            <g transform="translate(142, 105) rotate(15)">
              <line x1="10" y1="0" x2="10" y2="80" stroke="#D4AF37" strokeWidth="3" />
              <path d="M 2 15 L 2 0 L 10 10 L 18 0 L 18 15" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
            </g>
          )}

          {accessory === "berries" && (
            <g transform="translate(68, 150)">
              <circle cx="6" cy="6" r="5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
              <circle cx="12" cy="4" r="5" fill="#1E3A8A" stroke="#1D4ED8" strokeWidth="1" />
              <circle cx="10" cy="11" r="5" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1" />
            </g>
          )}
        </svg>
      </div>

      {/* Arena Metal Pedestal Base */}
      {showPedestal && (
        <div className="relative -mt-3 flex flex-col items-center">
          <div className="w-24 h-5 rounded-[50%] bg-gradient-to-r from-gray-700 via-gray-400 to-gray-800 border border-amber-400/50 shadow-[0_5px_15px_rgba(0,0,0,0.8)]" />
          <div className="w-28 h-2 rounded-[50%] bg-gradient-to-r from-gray-900 via-amber-600/30 to-gray-900 -mt-1" />
        </div>
      )}
    </div>
  );
}

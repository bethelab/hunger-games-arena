export const GAME_EDITION = "15th";

export const DISTRICTS = [
  {
    id: 1,
    name: "District 1",
    specialty: "CSS & Pixel Snobs",
    techRole: "Can center a div in a combat zone; will judge your font choices before attacking.",
    icon: "🎨",
    badge: "Pixel Perfectionist",
    color: "#7C3AED",
    accent: "#F97316",
    motto: "If it's off by 1px, we riot."
  },
  {
    id: 2,
    name: "District 2",
    specialty: "Friday 5 PM Deployers",
    techRole: "Pushes hotfixes directly to production on Friday afternoon without a staging check.",
    icon: "🔥",
    badge: "Prod Cowboy",
    color: "#9333EA",
    accent: "#EA580C",
    motto: "What could possibly go wrong?"
  },
  {
    id: 3,
    name: "District 3",
    specialty: "The 140+ Tab Hoarders",
    techRole: "Has an open tab from a StackOverflow question in 2021.",
    icon: "📑",
    badge: "RAM Consumer",
    color: "#6D28D9",
    accent: "#FB923C",
    motto: "I'll read it later, I swear."
  },
  {
    id: 4,
    name: "District 4",
    specialty: "Cold Brew Powered SREs",
    techRole: "Runs purely on nitro cold brew and pager alert cortisol; immune to panic.",
    icon: "☕",
    badge: "Pager Champion",
    color: "#5B21B6",
    accent: "#F97316",
    motto: "Everything is fine. The fire is warm."
  },
  {
    id: 5,
    name: "District 5",
    specialty: "AI Prompt Whisperers",
    techRole: "Won't fight with physical weapons; will ask AI for the optimal 3-step survival prompt.",
    icon: "🤖",
    badge: "Prompt Oracle",
    color: "#7E22CE",
    accent: "#F97316",
    motto: "Act as a tribute who never gets eliminated."
  },
  {
    id: 6,
    name: "District 6",
    specialty: "Force-Push Gladiators",
    techRole: "Solves merge conflicts with 'git push --force --no-verify' and deletes the Slack trail.",
    icon: "⚡",
    badge: "Merge Destroyer",
    color: "#6B21A8",
    accent: "#EA580C",
    motto: "History is written by whoever pushed last."
  },
  {
    id: 7,
    name: "District 7",
    specialty: "Unscheduled Meeting Lurkers",
    techRole: "Traps tributes in 'quick 5-minute huddles' that drain everyone's stamina for 45 minutes.",
    icon: "📅",
    badge: "Calendar Assassin",
    color: "#4C1D95",
    accent: "#FB923C",
    motto: "Let's take this offline."
  },
  {
    id: 8,
    name: "District 8",
    specialty: "Edge Case Bug Summoners",
    techRole: "Will break the Cornucopia by pressing the gong button with negative numerical values.",
    icon: "🐛",
    badge: "Chaos Tester",
    color: "#8B5CF6",
    accent: "#F97316",
    motto: "If you didn't want it clicked, why is it there?"
  },
  {
    id: 9,
    name: "District 9",
    specialty: "Legacy Code Archaeologists",
    techRole: "Survives by deciphering ancient commented-out scripts written by engineers 15 years ago.",
    icon: "📜",
    badge: "Relic Decoder",
    color: "#7C3AED",
    accent: "#EA580C",
    motto: "Do not touch this line or the sky falls."
  },
  {
    id: 10,
    name: "District 10",
    specialty: "Teams React-Only Communicators",
    techRole: "Communicates solely via 🚀, 👀, and 🫡 emojis on Teams.",
    icon: "👀",
    badge: "Emoji Phantom",
    color: "#6D28D9",
    accent: "#FB923C",
    motto: "🫡"
  },
  {
    id: 11,
    name: "District 11",
    specialty: "Dark Mode Zealots",
    techRole: "Temporarily blinded by daylight.",
    icon: "🕶️",
    badge: "Shadow Hacker",
    color: "#581C87",
    accent: "#F97316",
    motto: "Light mode burns the soul."
  },
  {
    id: 12,
    name: "District 12",
    specialty: "Works-On-My-Machine Denialists",
    techRole: "Refuses to acknowledge arena traps because 'it compiled fine in my local environment'.",
    icon: "💻",
    badge: "Localhost Victor",
    color: "#4C1D95",
    accent: "#EA580C",
    motto: "Must be a configuration issue on your end."
  }
];

export function getRandomDistrict() {
  return DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)];
}

// 9 Curated Preset Avatars (With strong female, male & neutral options)
export const AVATAR_PRESETS = [
  {
    id: "preset-1",
    name: "The Scout",
    avatar: {
      gender: "female",
      skinTone: "light",
      hairStyle: "ponytail",
      hairColor: "blonde",
      expression: "smirk",
      outfit: "jumpsuit",
      accessory: "bow"
    }
  },
  {
    id: "preset-2",
    name: "The Strategist",
    avatar: {
      gender: "female",
      skinTone: "fair",
      hairStyle: "bob",
      hairColor: "violet",
      expression: "calm",
      outfit: "cloak",
      accessory: "pin"
    }
  },
  {
    id: "preset-3",
    name: "The Firebrand",
    avatar: {
      gender: "female",
      skinTone: "light",
      hairStyle: "wild",
      hairColor: "orange",
      expression: "intense",
      outfit: "camo",
      accessory: "warpaint"
    }
  },
  {
    id: "preset-4",
    name: "The Cyber Rebel",
    avatar: {
      gender: "female",
      skinTone: "cyber",
      hairStyle: "dreads",
      hairColor: "violet",
      expression: "fierce",
      outfit: "stealth",
      accessory: "goggles"
    }
  },
  {
    id: "preset-5",
    name: "The Archer",
    avatar: {
      gender: "female",
      skinTone: "olive",
      hairStyle: "ponytail",
      hairColor: "black",
      expression: "fierce",
      outfit: "jumpsuit",
      accessory: "bow"
    }
  },
  {
    id: "preset-6",
    name: "The Gladiator",
    avatar: {
      gender: "male",
      skinTone: "olive",
      hairStyle: "buzz",
      hairColor: "black",
      expression: "fierce",
      outfit: "armor",
      accessory: "warpaint"
    }
  },
  {
    id: "preset-7",
    name: "The Champion",
    avatar: {
      gender: "male",
      skinTone: "dark",
      hairStyle: "dreads",
      hairColor: "black",
      expression: "smile",
      outfit: "cloak",
      accessory: "pin"
    }
  },
  {
    id: "preset-8",
    name: "The Hacker",
    avatar: {
      gender: "neutral",
      skinTone: "cyber",
      hairStyle: "hooded",
      hairColor: "violet",
      expression: "calm",
      outfit: "stealth",
      accessory: "goggles"
    }
  },
  {
    id: "preset-9",
    name: "The SRE",
    avatar: {
      gender: "neutral",
      skinTone: "medium",
      hairStyle: "mohawk",
      hairColor: "crimson",
      expression: "intense",
      outfit: "camo",
      accessory: "trident"
    }
  }
];

// The Customization Features and Rendering Colors
export const AVATAR_OPTIONS = {
  skinTones: [
    { id: "fair", color: "#FDE68A", label: "Fair" },
    { id: "light", color: "#FCD34D", label: "Sunlit" },
    { id: "medium", color: "#D97706", label: "Tan" },
    { id: "olive", color: "#B45309", label: "Bronze" },
    { id: "dark", color: "#78350F", label: "Deep" },
    { id: "cyber", color: "#C4B5FD", label: "Violet Shimmer" }
  ],
  hairColors: [
    { id: "black", color: "#1E1B4B" },
    { id: "brown", color: "#713F12" },
    { id: "blonde", color: "#FBBF24" },
    { id: "orange", color: "#F97316" },
    { id: "violet", color: "#7C3AED" },
    { id: "crimson", color: "#C026D3" },
    { id: "silver", color: "#E0E7FF" }
  ],
  outfits: [
    { id: "jumpsuit", color: "#4C1D95", accent: "#F97316" },
    { id: "armor", color: "#6D28D9", accent: "#FB923C" },
    { id: "camo", color: "#EA580C", accent: "#7C3AED" },
    { id: "cloak", color: "#9333EA", accent: "#F97316" },
    { id: "stealth", color: "#3B0764", accent: "#FB923C" }
  ],
  accessories: [
    { id: "pin", label: "Mockingjay Pin", icon: "🕊️" },
    { id: "bow", label: "Hunting Bow", icon: "🏹" },
    { id: "trident", label: "Cold Brew Mug", icon: "☕" },
    { id: "warpaint", label: "War Paint", icon: "⚔️" },
    { id: "goggles", label: "Holo Goggles", icon: "🥽" },
    { id: "berries", label: "Berries Pouch", icon: "🫐" }
  ]
};

export const MOCK_TRIBUTES_SAMPLE = [
  {
    id: "trib-1",
    realName: "Maya",
    districtId: 1,
    motto: "If it's off by 1px, we riot.",
    avatar: AVATAR_PRESETS[0].avatar,
    pedestalNumber: 1,
    status: "ready",
    joinedAt: "Just now"
  },
  {
    id: "trib-2",
    realName: "Dave",
    districtId: 2,
    motto: "What could possibly go wrong?",
    avatar: AVATAR_PRESETS[2].avatar,
    pedestalNumber: 4,
    status: "ready",
    joinedAt: "1m ago"
  },
  {
    id: "trib-3",
    realName: "Elena",
    districtId: 4,
    motto: "Everything is fine. The fire is warm.",
    avatar: AVATAR_PRESETS[3].avatar,
    pedestalNumber: 7,
    status: "ready",
    joinedAt: "2m ago"
  }
];

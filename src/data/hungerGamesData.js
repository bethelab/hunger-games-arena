export const GAME_EDITION = "15th";

export const DISTRICTS = [
  {
    id: 1,
    name: "District 1",
    specialty: "Pixel Perfect Crew",
    techRole: "Can center a div in a combat zone; will judge your font choices before attacking.",
    icon: "🎨",
    badge: "Pixel Perfect",
    color: "#7C3AED",
    accent: "#F97316",
    motto: ""
  },
  {
    id: 2,
    name: "District 2",
    specialty: "Friday 5 PM Deployers",
    techRole: "Pushes hotfixes directly to production on Friday afternoon without a staging check.",
    icon: "🔥",
    badge: "Prod Ready",
    color: "#9333EA",
    accent: "#EA580C",
    motto: ""
  },
  {
    id: 3,
    name: "District 3",
    specialty: "140+ Open Tabs",
    techRole: "Has an open tab from a StackOverflow question in 2021.",
    icon: "📑",
    badge: "Tab Collector",
    color: "#6D28D9",
    accent: "#FB923C",
    motto: ""
  },
  {
    id: 4,
    name: "District 4",
    specialty: "Cold Brew Crew",
    techRole: "Runs purely on iced coffee and sheer focus.",
    icon: "☕",
    badge: "Caffeinated",
    color: "#5B21B6",
    accent: "#F97316",
    motto: ""
  },
  {
    id: 5,
    name: "District 5",
    specialty: "AI Prompt Pros",
    techRole: "Will ask AI for the optimal 3-step survival plan before taking a single step.",
    icon: "🤖",
    badge: "Prompt Pro",
    color: "#7E22CE",
    accent: "#F97316",
    motto: ""
  },
  {
    id: 6,
    name: "District 6",
    specialty: "Force-Push Squad",
    techRole: "Solves merge conflicts with 'git push --force --no-verify'.",
    icon: "⚡",
    badge: "Git Bold",
    color: "#6B21A8",
    accent: "#EA580C",
    motto: ""
  },
  {
    id: 7,
    name: "District 7",
    specialty: "Quick 5-Min Huddle",
    techRole: "Turns every quick sync into a 45-minute strategy session.",
    icon: "📅",
    badge: "Meeting Host",
    color: "#4C1D95",
    accent: "#FB923C",
    motto: ""
  },
  {
    id: 8,
    name: "District 8",
    specialty: "Edge Case Finders",
    techRole: "Will break the Cornucopia by pressing the gong button with negative values.",
    icon: "🐛",
    badge: "QA Mind",
    color: "#8B5CF6",
    accent: "#F97316",
    motto: ""
  },
  {
    id: 9,
    name: "District 9",
    specialty: "Legacy Code Squad",
    techRole: "Survives by deciphering ancient scripts written 15 years ago.",
    icon: "📜",
    badge: "Code Historian",
    color: "#7C3AED",
    accent: "#EA580C",
    motto: ""
  },
  {
    id: 10,
    name: "District 10",
    specialty: "Teams Emoji Only",
    techRole: "Communicates solely via 🚀, 👀, and 🫡 emojis on Teams.",
    icon: "👀",
    badge: "React Pro",
    color: "#6D28D9",
    accent: "#FB923C",
    motto: ""
  },
  {
    id: 11,
    name: "District 11",
    specialty: "Dark Mode Only",
    techRole: "Temporarily blinded by daylight.",
    icon: "🕶️",
    badge: "Night Owl",
    color: "#581C87",
    accent: "#F97316",
    motto: ""
  },
  {
    id: 12,
    name: "District 12",
    specialty: "Works on My Machine",
    techRole: "Refuses to acknowledge arena traps because it compiled fine locally.",
    icon: "💻",
    badge: "Localhost",
    color: "#4C1D95",
    accent: "#EA580C",
    motto: ""
  }
];

export function getRandomDistrict() {
  return DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)];
}

// 12 Distinct Curated Preset Avatars with Interesting Names
export const AVATAR_PRESETS = [
  {
    id: "preset-1",
    name: "Ember",
    avatar: {
      gender: "female",
      skinTone: "fair",
      hairStyle: "wild",
      hairColor: "orange",
      expression: "intense",
      outfit: "camo",
      accessory: "warpaint"
    }
  },
  {
    id: "preset-2",
    name: "Vesper",
    avatar: {
      gender: "female",
      skinTone: "light",
      hairStyle: "bob",
      hairColor: "violet",
      expression: "calm",
      outfit: "cloak",
      accessory: "pin"
    }
  },
  {
    id: "preset-3",
    name: "Kestrel",
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
    id: "preset-4",
    name: "Nova",
    avatar: {
      gender: "female",
      skinTone: "cyber",
      hairStyle: "dreads",
      hairColor: "silver",
      expression: "smirk",
      outfit: "stealth",
      accessory: "goggles"
    }
  },
  {
    id: "preset-5",
    name: "Saffron",
    avatar: {
      gender: "female",
      skinTone: "medium",
      hairStyle: "ponytail",
      hairColor: "blonde",
      expression: "smile",
      outfit: "armor",
      accessory: "berries"
    }
  },
  {
    id: "preset-6",
    name: "Rowan",
    avatar: {
      gender: "female",
      skinTone: "dark",
      hairStyle: "bob",
      hairColor: "crimson",
      expression: "fierce",
      outfit: "cloak",
      accessory: "trident"
    }
  },
  {
    id: "preset-7",
    name: "Orion",
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
    id: "preset-8",
    name: "Atlas",
    avatar: {
      gender: "male",
      skinTone: "dark",
      hairStyle: "dreads",
      hairColor: "brown",
      expression: "smile",
      outfit: "cloak",
      accessory: "pin"
    }
  },
  {
    id: "preset-9",
    name: "Flint",
    avatar: {
      gender: "male",
      skinTone: "light",
      hairStyle: "mohawk",
      hairColor: "orange",
      expression: "smirk",
      outfit: "camo",
      accessory: "bow"
    }
  },
  {
    id: "preset-10",
    name: "Cinder",
    avatar: {
      gender: "male",
      skinTone: "fair",
      hairStyle: "hooded",
      hairColor: "silver",
      expression: "intense",
      outfit: "stealth",
      accessory: "goggles"
    }
  },
  {
    id: "preset-11",
    name: "Cipher",
    avatar: {
      gender: "neutral",
      skinTone: "cyber",
      hairStyle: "hooded",
      hairColor: "violet",
      expression: "calm",
      outfit: "stealth",
      accessory: "trident"
    }
  },
  {
    id: "preset-12",
    name: "Briar",
    avatar: {
      gender: "neutral",
      skinTone: "medium",
      hairStyle: "mohawk",
      hairColor: "crimson",
      expression: "intense",
      outfit: "jumpsuit",
      accessory: "berries"
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
    motto: "",
    avatar: AVATAR_PRESETS[0].avatar,
    pedestalNumber: 1,
    status: "ready",
    joinedAt: "Just now"
  },
  {
    id: "trib-2",
    realName: "Marcus",
    districtId: 2,
    motto: "",
    avatar: AVATAR_PRESETS[6].avatar,
    pedestalNumber: 4,
    status: "ready",
    joinedAt: "1m ago"
  }
];

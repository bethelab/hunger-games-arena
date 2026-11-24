# 🏹 Hunger Games: Would Our Team Survive? (Interactive Web App)

An interactive, dystopian web app designed for a **Workplace Share & Learn Presentation**. Team members scan a QR code from your presentation slide on their phone or laptop, enter the reaping, create their custom tribute emoji look, and stand on their live arena pedestal alongside their teammates.

---

## 🌟 Features Implemented

1. **Phase 1: The Capitol Reaping & Induction**
   - Dramatic Capitol intro and Hunger Games broadcast styling.
   - Team members input their real name (for host records / presentation tracking).
   - Official **District Assignment** mapped to workplace tech roles (e.g., District 3: Cloud & Network Architecture, District 2: Core Backend, District 8: Quality Assurance, District 12: Legacy Systems & Deep Debugging).
   - Automatic assignment of an **Anonymous Tribute Alias** (e.g. `D3 Cyber Vanguard #14`, `D12 Ember Weaver #77`) with a "Draw New Slip" re-roll button.

2. **Phase 2: The Capitol Remake Center (Emoji / Avatar Stylist)**
   - Interactive live vector avatar customizer:
     - **Identity & Gender:** Female, Male, Non-Binary / Neutral.
     - **Skin Complexion:** 6 realistic and stylized Capitol skin tones.
     - **Hairstyles & Capitol Dyes:** 8 hairstyles (Ponytail, Buzz Cut, Dreads, Capitol Spikes, Bob, Mohawk, Wild Curls, Rebel Hood) with vibrant dye colors.
     - **Game Face / Expressions:** Fierce Warrior, Confident Smirk, Cold Strategist, Intensity, Charm.
     - **Combat Uniforms:** District Jumpsuit, Heavy Armor, Forest Camo, Girl on Fire Cloak, Midnight Stealth.
     - **Arena Gear & Signature Weapons:** Mockingjay Pin, Hunting Bow, Trident, War Paint, Holo-Goggles, Nightlock Berries.
     - **"Stylist Special" Button:** Instant random stylish combination generator.

3. **Phase 3: The Launch Tube & Arena Pedestals**
   - Hydraulic audio and elevator ascension when entering.
   - **24 Arena Pedestals** surrounding the Golden Cornucopia.
   - **Real-Time Presence:**
     - Displays your glowing pedestal with "LOCKED & ARMED" status.
     - Displays all confirmed teammates who have completed their tribute avatars.
     - New tributes pop up live as they click done.
   - **60-Second Cornucopia Countdown Clock:** Ticking clock with gong/cannon audio cue when it hits 0.
   - **Caesar Flickerman Commentary Ticker:** Dynamic live broadcast announcements as tributes take their positions.
   - **Integrated Sound FX (Zero External Dependencies):** Capitol trumpet fanfare, hydraulic pedestal rumble, countdown beeps, and cannon boom synthesized via the Web Audio API.

4. **Presenter Presentation Tools**
   - **Slide QR Code Generator:** Click "Presenter QR / Slide" in the top bar to generate a scannable QR code directly on your slide or screen.
   - **Live Coworker Simulation:** A "Simulate Tribute Joining" button in the presenter modal lets you demonstrate the live pop-up mechanics during practice or presentations without needing 24 phones.
   - **Roster Drawer:** Easily view all tributes in the arena, with an optional toggle to reveal real coworker names.

---

## 🚀 How to Run Locally

```bash
# Navigate to project
cd hunger-games-arena

# Install dependencies (if not already installed)
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:3000` (or the IP shown to test from your phone on the same Wi-Fi!).

---

## 🌐 How to Deploy (Free on GitHub Pages or Cloudflare Pages)

### Option A: GitHub Pages (Automatic with GitHub Actions)
1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial Hunger Games Tribute Launch Arena"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
   - The included workflow (`.github/workflows/deploy.yml`) will build and deploy the app automatically!

### Option B: Cloudflare Pages
1. Connect your GitHub repository to Cloudflare Pages.
2. Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
3. Click **Deploy**.

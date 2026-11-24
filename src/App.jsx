import React, { useState, useEffect } from 'react';
import ReapingScreen from './components/ReapingScreen';
import AvatarCreator from './components/AvatarCreator';
import ArenaLobby from './components/ArenaLobby';
import HostController from './components/HostController';
import { getRandomDistrict, AVATAR_PRESETS } from './data/hungerGamesData';

// Use sessionStorage so each tab/device is a unique, independent tribute
const SESSION_STORAGE_KEY = "panem_tribute_session_v4";

function getRouteFromHash() {
  if (typeof window === 'undefined') return 'reaping';
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (['reaping', 'stylist', 'arena', 'controller'].includes(raw)) {
    return raw;
  }
  return 'reaping';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getRouteFromHash);

  // Each browser tab/window gets its own isolated tribute identity
  const [tributeData, setTributeData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {}
    }
    const randomDist = getRandomDistrict();
    // Unique ID per browser tab or phone session
    const uniqueTabId = "trib-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
    return {
      id: uniqueTabId,
      role: 'tribute',
      realName: '',
      alias: '',
      districtId: randomDist.id,
      motto: randomDist.motto,
      avatar: AVATAR_PRESETS[0].avatar
    };
  });

  // Save per-tab session
  useEffect(() => {
    if (tributeData && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(tributeData));
      } catch (e) {}
    }
  }, [tributeData]);

  // Handle URL hash changes (#/reaping, #/stylist, #/arena, #/controller)
  useEffect(() => {
    const handleHashChange = () => {
      const next = getRouteFromHash();
      setCurrentRoute(next);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${route}`;
    }
  };

  // Step 1 Complete: Reaping
  const handleReapingComplete = (reapingDetails) => {
    setTributeData(prev => ({
      ...prev,
      ...reapingDetails
    }));
    navigateTo('stylist');
  };

  // Step 2 Complete: Stylist / Avatar
  const handleStylistComplete = (fullTribute) => {
    setTributeData(fullTribute);
    navigateTo('arena');
  };

  return (
    <div className="min-h-screen">
      {currentRoute === 'reaping' && (
        <ReapingScreen
          initialData={tributeData}
          onComplete={handleReapingComplete}
        />
      )}

      {currentRoute === 'stylist' && (
        <AvatarCreator
          tributeData={tributeData}
          onBack={() => navigateTo('reaping')}
          onComplete={handleStylistComplete}
        />
      )}

      {currentRoute === 'arena' && (
        <ArenaLobby
          currentTribute={tributeData}
          onNavigate={navigateTo}
        />
      )}

      {currentRoute === 'controller' && (
        <HostController
          onNavigate={navigateTo}
        />
      )}
    </div>
  );
}

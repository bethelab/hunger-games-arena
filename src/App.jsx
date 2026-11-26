import React, { useState, useEffect } from 'react';
import HomePresentation from './components/HomePresentation';
import ReapingScreen from './components/ReapingScreen';
import AvatarCreator from './components/AvatarCreator';
import ArenaLobby from './components/ArenaLobby';
import HostController from './components/HostController';
import PresenterNotes from './components/PresenterNotes';
import { syncService } from './services/syncService';
import { getRandomDistrict, AVATAR_PRESETS } from './data/hungerGamesData';

// Use sessionStorage so each tab/device is a unique, independent session
const SESSION_STORAGE_KEY = "panem_tribute_session_v4";

function getRouteFromHash() {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (['home', 'reaping', 'stylist', 'arena', 'controller', 'notes'].includes(raw)) {
    return raw;
  }
  return 'home';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getRouteFromHash);
  const [game, setGame] = useState(syncService.getGame());

  const [tributeData, setTributeData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    const randomDist = getRandomDistrict();
    const uniqueTabId = "trib-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
    return {
      id: uniqueTabId,
      role: 'tribute',
      gamemakerAuthed: false,
      realName: '',
      alias: '',
      districtId: randomDist.id,
      motto: '',
      avatar: AVATAR_PRESETS[0].avatar
    };
  });

  // Subscribe to global game state so Home automatically hands off when Gamemaker clicks "Let the Games Begin"
  useEffect(() => {
    const unsubscribe = syncService.subscribe(null, null, (updatedGame) => {
      setGame(updatedGame);
    });
    return () => unsubscribe();
  }, []);

  // Auto-advance from 'home' once Gamemaker starts the Games!
  useEffect(() => {
    if (currentRoute === 'home' && game?.started) {
      if (tributeData?.role === 'gamemaker' && tributeData?.gamemakerAuthed) {
        navigateTo('arena');
      } else {
        navigateTo('reaping');
      }
    }
  }, [game?.started, currentRoute, tributeData?.role, tributeData?.gamemakerAuthed]);

  // Save per-tab session
  useEffect(() => {
    if (tributeData && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(tributeData));
      } catch (e) {}
    }
  }, [tributeData]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getRouteFromHash());
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

  // Gamemaker signs in from Home -> goes to Stylist to pick avatar -> returns to Home slides
  const handleGamemakerAuth = (name) => {
    setTributeData(prev => ({
      ...prev,
      role: 'gamemaker',
      gamemakerAuthed: true,
      realName: name,
      alias: name
    }));
    navigateTo('stylist');
  };

  // Gamemaker clicks "Let the Games Begin!" on Home slides
  const handleBeginGames = async () => {
    await syncService.controlGame('begin_games');
    navigateTo('arena');
  };

  // Player Step 1 Complete: Reaping -> Stylist
  const handleReapingComplete = (reapingDetails) => {
    setTributeData(prev => ({
      ...prev,
      ...reapingDetails,
      gamemakerAuthed: reapingDetails.role === 'gamemaker' ? true : prev.gamemakerAuthed
    }));
    navigateTo('stylist');
  };

  // Stylist Complete:
  // - If Gamemaker signed in before Games started -> return to Home slides!
  // - Otherwise -> enter Arena!
  const handleStylistComplete = (fullTribute) => {
    setTributeData(fullTribute);
    if (fullTribute.role === 'gamemaker' && !game?.started) {
      navigateTo('home');
    } else {
      navigateTo('arena');
    }
  };

  return (
    <div className="min-h-screen">
      {currentRoute === 'home' && (
        <HomePresentation
          tributeData={tributeData}
          game={game}
          onGamemakerAuth={handleGamemakerAuth}
          onBeginGames={handleBeginGames}
        />
      )}

      {currentRoute === 'reaping' && (
        <ReapingScreen
          initialData={tributeData}
          onComplete={handleReapingComplete}
        />
      )}

      {currentRoute === 'stylist' && (
        <AvatarCreator
          tributeData={tributeData}
          onBack={() => navigateTo(tributeData?.role === 'gamemaker' && !game?.started ? 'home' : 'reaping')}
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

      {currentRoute === 'notes' && (
        <PresenterNotes />
      )}
    </div>
  );
}

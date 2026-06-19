import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerMode, TimerSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { playChime, playWorkEnd, playStart, playPause } from '../utils/sound';
import { loadFromStorage, saveToStorage } from '../utils/storage';

interface UseTimerReturn {
  mode: TimerMode;
  remaining: number; // seconds
  isRunning: boolean;
  sessions: number;
  settings: TimerSettings;
  resetCount: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  updateSettings: (s: TimerSettings) => void;
  totalDuration: number; // current mode total seconds
}

export function useTimer(): UseTimerReturn {
  const [mode, setMode] = useState<TimerMode>('work');
  const [remaining, setRemaining] = useState(DEFAULT_SETTINGS.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [settings, setSettings] = useState<TimerSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...loadFromStorage<Partial<TimerSettings>>('pomodoro-settings', {}),
  }));

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;

  const totalDuration = settings[mode] * 60;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    playStart();
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    playPause();
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    setRemaining(settings[mode] * 60);
    setResetCount((c) => c + 1);
  }, [clearTimer, mode, settings]);

  const switchMode = useCallback(
    (currentMode: TimerMode, currentSessions: number) => {
      if (currentMode === 'work') {
        const newSessions = currentSessions + 1;
        setSessions(newSessions);
        // Every 4 work sessions → long break
        const nextMode: TimerMode =
          newSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        setRemaining(settings[nextMode] * 60);
        playWorkEnd();
        showNotification(
          '番茄时间结束！',
          nextMode === 'longBreak'
            ? `已完成 ${newSessions} 个番茄，该长休息了`
            : `已完成 ${newSessions} 个番茄，休息一下吧`,
        );
      } else {
        setMode('work');
        setRemaining(settings.work * 60);
        playChime();
        showNotification('休息结束', '开始新的番茄钟吧！');
      }
    },
    [settings],
  );

  const skip = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    switchMode(mode, sessionsRef.current);
  }, [clearTimer, mode, switchMode]);

  // Countdown effect
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          // Time's up — switch mode on next tick
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  // When remaining hits 0, switch mode
  useEffect(() => {
    if (remaining === 0 && isRunning) {
      setIsRunning(false);
      clearTimer();
      switchMode(mode, sessionsRef.current);
    }
  }, [remaining, isRunning, mode, clearTimer, switchMode]);

  const updateSettings = useCallback((s: TimerSettings) => {
    setSettings(s);
    saveToStorage('pomodoro-settings', s);
  }, []);

  // Track previous mode/settings to only reset when they actually change
  const prevModeRef = useRef(mode);
  const prevSettingsRef = useRef(settings);

  // Reset remaining when mode or settings change (while paused)
  useEffect(() => {
    if (!isRunning) {
      if (mode !== prevModeRef.current || settings !== prevSettingsRef.current) {
        setRemaining(settings[mode] * 60);
      }
    }
    prevModeRef.current = mode;
    prevSettingsRef.current = settings;
  }, [mode, settings, isRunning]);

  return {
    mode,
    remaining,
    isRunning,
    sessions,
    settings,
    resetCount,
    start,
    pause,
    reset,
    skip,
    updateSettings,
    totalDuration,
  };
}

function showNotification(title: string, body: string): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '🍅' });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, { body, icon: '🍅' });
      }
    });
  }
}

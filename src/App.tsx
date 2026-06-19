import { useState, useEffect } from 'react';
import { useTimer } from './hooks/useTimer';
import { TimerRing } from './components/TimerRing';
import { Controls } from './components/Controls';
import { ModeIndicator } from './components/ModeIndicator';
import { Settings } from './components/Settings';
import { TaskList } from './components/TaskList';
import type { Task } from './types';
import { loadFromStorage, saveToStorage } from './utils/storage';
import './App.css';

const GEAR_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export default function App() {
  const timer = useTimer();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage<Task[]>('pomodoro-tasks', []),
  );

  // Persist tasks
  useEffect(() => {
    saveToStorage('pomodoro-tasks', tasks);
  }, [tasks]);

  const handleAddTask = (text: string) => {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut: Space to start/pause
  const { isRunning, start, pause } = timer;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          pause();
        } else {
          start();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, start, pause]);

  return (
    <div className="app">
      <div className="app__main">
        <ModeIndicator
          mode={timer.mode}
          sessions={timer.sessions}
          isRunning={timer.isRunning}
        />

        <TimerRing
          remaining={timer.remaining}
          totalDuration={timer.totalDuration}
          mode={timer.mode}
          isRunning={timer.isRunning}
          resetCount={timer.resetCount}
        />

        <Controls
          isRunning={timer.isRunning}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
          onSkip={timer.skip}
        />

        <button
          className="app__settings-btn"
          onClick={() => setSettingsOpen(true)}
          title="设置"
        >
          {GEAR_ICON}
        </button>

        <p className="app__hint">按空格键 {timer.isRunning ? '暂停' : '开始'}</p>
      </div>

      <div className="app__sidebar">
        <TaskList
          tasks={tasks}
          onAdd={handleAddTask}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      </div>

      <Settings
        settings={timer.settings}
        onUpdate={timer.updateSettings}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

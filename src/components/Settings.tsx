import { useState, useEffect } from 'react';
import type { TimerSettings } from '../types';
import './Settings.css';

interface SettingsProps {
  settings: TimerSettings;
  onUpdate: (s: TimerSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ settings, onUpdate, isOpen, onClose }: SettingsProps) {
  const [draft, setDraft] = useState<TimerSettings>(settings);

  useEffect(() => {
    setDraft(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const clamped: TimerSettings = {
      work: Math.max(1, Math.min(120, draft.work)),
      shortBreak: Math.max(1, Math.min(60, draft.shortBreak)),
      longBreak: Math.max(1, Math.min(120, draft.longBreak)),
    };
    onUpdate(clamped);
    onClose();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-panel__header">
          <h2>设置</h2>
          <button className="settings-panel__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-panel__body">
          <label className="settings-field">
            <span>工作时间（分钟）</span>
            <input
              type="number"
              min={1}
              max={120}
              value={draft.work}
              onChange={(e) =>
                setDraft((d) => ({ ...d, work: Number(e.target.value) }))
              }
            />
          </label>

          <label className="settings-field">
            <span>短休息（分钟）</span>
            <input
              type="number"
              min={1}
              max={60}
              value={draft.shortBreak}
              onChange={(e) =>
                setDraft((d) => ({ ...d, shortBreak: Number(e.target.value) }))
              }
            />
          </label>

          <label className="settings-field">
            <span>长休息（分钟）</span>
            <input
              type="number"
              min={1}
              max={120}
              value={draft.longBreak}
              onChange={(e) =>
                setDraft((d) => ({ ...d, longBreak: Number(e.target.value) }))
              }
            />
          </label>
        </div>

        <div className="settings-panel__footer">
          <button className="settings-btn settings-btn--save" onClick={handleSave}>
            保存
          </button>
          <button className="settings-btn settings-btn--cancel" onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

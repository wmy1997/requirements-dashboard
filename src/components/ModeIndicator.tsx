import type { TimerMode } from '../types';
import { MODE_LABELS } from '../types';
import './ModeIndicator.css';

interface ModeIndicatorProps {
  mode: TimerMode;
  sessions: number;
  isRunning: boolean;
}

export function ModeIndicator({ mode, sessions, isRunning }: ModeIndicatorProps) {
  return (
    <div className={`mode-indicator ${isRunning ? `mode-indicator--${mode}` : 'mode-indicator--paused'}`}>
      <div className="mode-indicator__label">
        {MODE_LABELS[mode]}
        {isRunning && <span className="mode-indicator__dot" />}
      </div>
      <div className="mode-indicator__sessions">
        {Array.from({ length: sessions }, (_, i) => (
          <span key={i} className="mode-indicator__tomato">🍅</span>
        ))}
        {sessions === 0 && (
          <span className="mode-indicator__hint">准备开始第一个番茄</span>
        )}
      </div>
    </div>
  );
}

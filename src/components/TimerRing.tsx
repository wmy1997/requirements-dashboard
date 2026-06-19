import type { TimerMode } from '../types';
import './TimerRing.css';

interface TimerRingProps {
  remaining: number; // seconds
  totalDuration: number; // seconds
  mode: TimerMode;
  isRunning: boolean;
  resetCount: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function TimerRing({ remaining, totalDuration, mode, isRunning, resetCount }: TimerRingProps) {
  const radius = 140;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = totalDuration > 0 ? remaining / totalDuration : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={`timer-ring ${isRunning ? `timer-ring--${mode}` : 'timer-ring--paused'}`}>
      <svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        {/* Background circle */}
        <circle
          stroke="var(--ring-bg)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle — key prop on resetCount makes React remount it, skipping transition */}
        <circle
          key={resetCount}
          className="timer-ring__progress"
          stroke="var(--ring-color)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: 'stroke-dashoffset 0.95s linear',
          }}
        />
      </svg>
      <div className="timer-ring__time">{formatTime(remaining)}</div>
    </div>
  );
}

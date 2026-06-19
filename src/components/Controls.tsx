import './Controls.css';

const PAUSE_ICON = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

const PLAY_ICON = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const RESET_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const SKIP_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
  </svg>
);

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function Controls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
}: ControlsProps) {
  return (
    <div className="controls">
      <button
        className={`controls__main ${isRunning ? 'controls__main--pause' : 'controls__main--start'}`}
        onClick={isRunning ? onPause : onStart}
        title={isRunning ? '暂停' : '开始'}
      >
        {isRunning ? PAUSE_ICON : PLAY_ICON}
        <span>{isRunning ? '暂停' : '开始'}</span>
      </button>

      <button className="controls__secondary" onClick={onReset} title="重置">
        {RESET_ICON}
        <span>重置</span>
      </button>

      <button className="controls__secondary" onClick={onSkip} title="跳过">
        {SKIP_ICON}
        <span>跳过</span>
      </button>
    </div>
  );
}

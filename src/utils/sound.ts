let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

interface NoteOptions {
  type?: OscillatorType;
  peakGain?: number;
  attackTime?: number;
  totalTime?: number;
}

function playNote(
  ctx: AudioContext,
  now: number,
  frequency: number,
  offset: number,
  options: NoteOptions = {},
): void {
  const {
    type = 'sine',
    peakGain = 0.2,
    attackTime = 0.02,
    totalTime = 0.15,
  } = options;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now + offset);
  gain.gain.setValueAtTime(0, now + offset);
  gain.gain.linearRampToValueAtTime(peakGain, now + offset + attackTime);
  gain.gain.linearRampToValueAtTime(0, now + offset + totalTime);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now + offset);
  osc.stop(now + offset + totalTime);
}

function safePlay(fn: () => void): void {
  try {
    fn();
  } catch {
    // Silently fail if Audio API is unavailable
  }
}

export function playStart(): void {
  safePlay(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Rising two-note: A4 → C5
    playNote(ctx, now, 440, 0);
    playNote(ctx, now, 523.25, 0.1);
  });
}

export function playPause(): void {
  safePlay(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Descending two-note: C5 → A4
    playNote(ctx, now, 523.25, 0);
    playNote(ctx, now, 440, 0.1);
  });
}

export function playChime(): void {
  safePlay(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Pleasant three-note chime: C5 → E5 → G5
    [523.25, 659.25, 783.99].forEach((freq, i) =>
      playNote(ctx, now, freq, i * 0.12, { peakGain: 0.3, totalTime: 0.2 }),
    );
  });
}

export function playWorkEnd(): void {
  safePlay(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Ascending arpeggio: G4 → C5 → E5 → G5 → C6
    const frequencies = [392, 523.25, 659.25, 783.99, 1046.5];
    frequencies.forEach((freq, i) =>
      playNote(ctx, now, freq, i * 0.08, {
        type: 'triangle',
        peakGain: 0.3,
        attackTime: 0.01,
        totalTime: 0.15,
      }),
    );
  });
}

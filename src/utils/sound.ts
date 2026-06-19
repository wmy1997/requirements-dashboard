let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playClick(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Silently fail
  }
}

export function playStart(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Rising two-note: A4 → C5
    [440, 523.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.02);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.15);
    });
  } catch {
    // Silently fail
  }
}

export function playPause(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Descending two-note: C5 → A4
    [523.25, 440].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.02);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.15);
    });
  } catch {
    // Silently fail
  }
}

export function playChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Play a pleasant three-note chime: C5 → E5 → G5
    const frequencies = [523.25, 659.25, 783.99];
    const duration = 0.2;
    const gap = 0.12;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * gap);

      gain.gain.setValueAtTime(0, now + i * gap);
      gain.gain.linearRampToValueAtTime(0.3, now + i * gap + 0.02);
      gain.gain.linearRampToValueAtTime(0, now + i * gap + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * gap);
      osc.stop(now + i * gap + duration);
    });
  } catch {
    // Silently fail if Audio API is unavailable
  }
}

export function playWorkEnd(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // More energetic: ascending arpeggio
    const frequencies = [392, 523.25, 659.25, 783.99, 1046.5];
    const duration = 0.15;
    const gap = 0.08;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * gap);

      gain.gain.setValueAtTime(0, now + i * gap);
      gain.gain.linearRampToValueAtTime(0.3, now + i * gap + 0.01);
      gain.gain.linearRampToValueAtTime(0, now + i * gap + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * gap);
      osc.stop(now + i * gap + duration);
    });
  } catch {
    // Silently fail if Audio API is unavailable
  }
}

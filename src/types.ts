export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  work: number; // minutes
  shortBreak: number; // minutes
  longBreak: number; // minutes
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

export const MODE_LABELS: Record<TimerMode, string> = {
  work: '工作时间',
  shortBreak: '短休息',
  longBreak: '长休息',
};

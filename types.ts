
export interface UserConfig {
  currentSalary: number;
  targetSalary: number;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  lunchStart: string;
  lunchEnd: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isTracking?: boolean;
  elapsedTime?: number; // total milliseconds
  lastStartTime?: number; // timestamp
}

export interface DayHistory {
  date: string; // YYYY-MM-DD
  completedCount: number;
  totalCount: number;
}

export interface TrainingStats {
  typingMinutes: number;
  readingCount: number;
  copyMinutes: number;
}

export enum Page {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  TASKS = 'TASKS',
  TRAIN = 'TRAIN',
  STATS = 'STATS',
  ZOMBIE = 'ZOMBIE',
  CALENDAR = 'CALENDAR'
}

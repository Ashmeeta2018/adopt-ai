import type { ScheduleConfig } from './types;

interface RegisteredSchedule {
  agentId: string;
  schedule: ScheduleConfig;
  lastRunAt: number | null;
}

function parseCronField(field: string, minValue: number, maxValue: number): number[] {
  if (field === '*') {
    return Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i);
  }

  const values: number[] = [];
  for (const part of field.split(',')) {
    if (part.includes('/')) {
      const slashParts = part.split('/');
      const range = slashParts[0] ?? '*';
      const step = slashParts[1];
      const stepNum = step ? Number(step) : 1;
      const start = range === '*' ? minValue : Number(range);
      for (let v = start; v <= maxValue; v += stepNum) {
        values.push(v);
      }
    } else if (part.includes('-')) {
      const dashParts = part.split('-');
      const lo = Number(dashParts[0] ?? 0);
      const hi = Number(dashParts[1] ?? 0);
      for (let v = lo; v <= hi; v++) {
        values.push(v);
      }
    } else {
      values.push(Number(part));
    }
  }
  return values;
}

function matchesCron(cron: string, date: Date): boolean {
  const raw = cron.trim().split(/\s+/);
  if (raw.length !== 5) {
    throw new Error(`Invalid cron expression: "${cron}". Expected 5 fields (minute hour day month weekday).`);
  }

  const minuteField = raw[0];
  const hourField = raw[1];
  const dayField = raw[2];
  const monthField = raw[3];
  const weekdayField = raw[4];
  if (!minuteField || !hourField || !dayField || !monthField || !weekdayField) {
    throw new Error(`Invalid cron expression: "${cron}".`);
  }

  const minutes = parseCronField(minuteField, 0, 59);
  const hours = parseCronField(hourField, 0, 23);
  const days = parseCronField(dayField, 1, 31);
  const months = parseCronField(monthField, 1, 12);
  const weekdays = parseCronField(weekdayField, 0, 6);

  return (
    minutes.includes(date.getMinutes()) &&
    hours.includes(date.getHours()) &&
    days.includes(date.getDate()) &&
    months.includes(date.getMonth() + 1) &&
    weekdays.includes(date.getDay())
  );
}

function nextCronOccurrence(cron: string, after: Date): Date {
  const candidate = new Date(after.getTime());
  candidate.setMinutes(candidate.getMinutes() + 1, 0, 0);

  const maxIterations = 525_600;
  for (let i = 0; i < maxIterations; i++) {
    if (matchesCron(cron, candidate)) {
      return candidate;
    }
    candidate.setMinutes(candidate.getMinutes() + 1);
  }

  return new Date(after.getTime() + 365 * 24 * 60 * 60 * 1000);
}

export class Scheduler {
  private readonly schedules = new Map<string, RegisteredSchedule>();

  register(agentId: string, schedule: ScheduleConfig): void {
    this.schedules.set(agentId, { agentId, schedule, lastRunAt: null });
  }

  unregister(agentId: string): void {
    this.schedules.delete(agentId);
  }

  updateSchedule(agentId: string, schedule: ScheduleConfig): void {
    const existing = this.schedules.get(agentId);
    if (!existing) {
      this.register(agentId, schedule);
      return;
    }
    this.schedules.set(agentId, { ...existing, schedule });
  }

  getPending(agentId: string): Date | null {
    const entry = this.schedules.get(agentId);
    if (!entry || !entry.schedule.enabled) {
      return null;
    }
    const after = entry.lastRunAt ? new Date(entry.lastRunAt) : new Date();
    return nextCronOccurrence(entry.schedule.cron, after);
  }

  getAllSchedules(): Array<{ agentId: string; schedule: ScheduleConfig; nextDueAt: Date | null }> {
    return Array.from(this.schedules.values()).map((entry) => ({
      agentId: entry.agentId,
      schedule: entry.schedule,
      nextDueAt: this.getPending(entry.agentId),
    }));
  }

  tick(): Array<{ agentId: string; dueAt: Date }> {
    const now = new Date();
    const due: Array<{ agentId: string; dueAt: Date }> = [];

    for (const entry of this.schedules.values()) {
      if (!entry.schedule.enabled) continue;

      const lastRun = entry.lastRunAt ? new Date(entry.lastRunAt) : new Date(0);
      const next = nextCronOccurrence(entry.schedule.cron, lastRun);

      if (next <= now) {
        due.push({ agentId: entry.agentId, dueAt: next });
        entry.lastRunAt = now.getTime();
      }
    }

    return due;
  }
}

import { test, expect } from 'vitest';
import { passesCutoffs } from '@/lib/logistics';

const base = new Date('2025-08-24T10:00:00Z');

function dPlus(days:number){ const d = new Date(base); d.setDate(d.getDate()+days); return d; }

test('same-day cutoff rejects after cutoff', () => {
  const ctx = { now: base, sameDayCutoffMin: 9*60 }; // 9:00 cutoff
  // slot today at 12:00 -> startMin=720, now time 10:00 UTC (simulate local same); nowMin=600 > 540? yes -> should be false
  const slotDate = dPlus(0); slotDate.setHours(12,0,0,0);
  expect(passesCutoffs(slotDate, 12*60, ctx)).toBe(false);
});

test('lead time enforced', () => {
  const now = base;
  const slotDate = new Date(now.getTime() + 2*3600_000); // 2 hours from now
  const ctx = { now, leadTimeHours: 3 };
  expect(passesCutoffs(slotDate, slotDate.getHours()*60+slotDate.getMinutes(), ctx)).toBe(false);
});

test('next-day cutoff applied', () => {
  const now = base; // 10:00
  const slotDate = dPlus(1); slotDate.setHours(9,0,0,0);
  const ctx = { now, nextDayCutoffMin: 8*60 }; // must book next-day before 08:00 today
  expect(passesCutoffs(slotDate, 9*60, ctx)).toBe(false);
});

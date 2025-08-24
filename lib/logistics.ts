import { prisma } from '@/lib/prisma';

// Minutes helper HH:MM -> total minutes
export function timeToMin(t:string){
  const [h,m] = t.split(':').map(Number); return h*60 + m;
}

export interface CutoffContext {
  now?: Date; // injectable for tests
  sameDayCutoffMin?: number; // minutes from midnight local
  nextDayCutoffMin?: number;
  leadTimeHours?: number;
}

// Determine if a slot date/startMin passes cutoff rules
export function passesCutoffs(slotDate:Date, slotStartMin:number, ctx:CutoffContext){
  const now = ctx.now || new Date();
  const startDay = new Date(slotDate); startDay.setHours(0,0,0,0);
  const today = new Date(now); today.setHours(0,0,0,0);
  const diffDays = Math.round((startDay.getTime()-today.getTime())/86400000);
  // lead time
  if(ctx.leadTimeHours && ctx.leadTimeHours>0){
    const earliest = new Date(now.getTime() + ctx.leadTimeHours*3600_000);
    if(slotDate < earliest) return false;
  }
  if(diffDays===0 && ctx.sameDayCutoffMin!=null){
    const nowMin = now.getHours()*60 + now.getMinutes();
    if(nowMin > ctx.sameDayCutoffMin) return false;
  }
  if(diffDays===1 && ctx.nextDayCutoffMin!=null){
    const nowMin = now.getHours()*60 + now.getMinutes();
    if(nowMin > ctx.nextDayCutoffMin) return false;
  }
  return true;
}

// Find capacity baseline for a given city + day + time (returns undefined if none)
export async function resolveCapacity(cityId:string, dayOfWeek:number, startMin:number){
  const rules = await prisma.slotCapacity.findMany({ where:{ cityId, active:true, dayOfWeek }, orderBy:{ startMin:'asc' } });
  for(const r of rules){
    if(startMin >= r.startMin && startMin < r.endMin) return r.capacity;
  }
  return undefined;
}

export async function getCutoffContext(cityId:string):Promise<CutoffContext>{
  const rule = await prisma.cutoffRule.findFirst({ where:{ cityId, active:true } });
  if(!rule) return {};
  return { sameDayCutoffMin: rule.sameDayCutoffMin, nextDayCutoffMin: rule.nextDayCutoffMin, leadTimeHours: rule.leadTimeHours };
}

export async function listActiveDeliveryWindows(cityId:string){
  return prisma.deliveryWindow.findMany({ where:{ cityId, active:true }, orderBy:{ startMin:'asc' } });
}

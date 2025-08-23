// settings-commit-anchor
export type FeatureFlags = {
  services: {
    halls: { enabled: boolean };
    dhabaeh: { enabled: boolean }; // ذبايح
  };
  auth?: {
    otp?: { enabled: boolean };
  }
};

// Temporary in-memory flags (Phase 0). To be persisted via Super Admin settings later.
export const featureFlags: FeatureFlags = {
  services: {
    halls: { enabled: true },
    dhabaeh: { enabled: true },
  },
  auth: { otp: { enabled: false } }
};

export function isServiceEnabled(key: keyof FeatureFlags['services']) {
  return featureFlags.services[key].enabled;
}

// DB-backed feature flags loader (Phase 0 fallback to in-memory)
import { prisma } from "@/lib/prisma";

export async function loadFeatureFlags(): Promise<FeatureFlags> {
  try {
  // Using raw query fallback in case Prisma client not regenerated with model yet
  const rows: any[] = await prisma.$queryRawUnsafe("SELECT key, value FROM FeatureFlag");
    const clone: FeatureFlags = JSON.parse(JSON.stringify(featureFlags));
    for (const row of rows) {
      const parts = row.key.split('.')
      if(parts[0]==='services' && parts.length===3){
        const [,svc,prop]=parts; if(svc in clone.services && prop==='enabled' && typeof row.value?.enabled==='boolean'){ // @ts-ignore
          clone.services[svc].enabled = row.value.enabled; }
      }
      if(parts[0]==='auth' && parts[1]==='otp' && parts[2]==='enabled'){
        if(!clone.auth) clone.auth = { otp:{ enabled:false }};
        if(!clone.auth.otp) clone.auth.otp = { enabled:false };
        if(typeof row.value?.enabled==='boolean') clone.auth.otp.enabled = row.value.enabled;
      }
    }
    return clone;
  } catch (e) {
    return featureFlags; // fallback on any error
  }
}

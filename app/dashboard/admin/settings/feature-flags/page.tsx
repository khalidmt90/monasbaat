import { requireAdmin } from "@/lib/auth";
import FeatureFlagsClient from "./Client";
import { prisma } from "@/lib/prisma";

export default async function FeatureFlagsPage(){
  await requireAdmin();
  const rows: any[] = await prisma.$queryRawUnsafe("SELECT id,key,value FROM FeatureFlag ORDER BY key ASC");
  return <FeatureFlagsClient initialFlags={rows.map(r=>({id:r.id,key:r.key,value:r.value}))} />;
}


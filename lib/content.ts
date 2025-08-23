import { prisma } from "@/lib/prisma";
// settings-commit-anchor: dynamic homepage content via GlobalConfig

export type Localized = { ar?: string; en?: string };

export type HomeContent = {
  hero?: {
    halls?: { headline?: Localized; cta?: Localized; image?: string };
    dhabaeh?: { headline?: Localized; cta?: Localized; image?: string };
  };
  how?: {
    halls?: { steps?: { text: Localized; icon?: string }[] };
    dhabaeh?: { steps?: { text: Localized; icon?: string }[] };
  };
  trust?: { signals?: { title: Localized; desc?: Localized; icon?: string }[] };
  cities?: { tagline?: Localized };
};

export async function loadHomeContent(): Promise<HomeContent> {
  const p: any = prisma as any;
  const rows = await p.globalConfig.findMany({ where: { key: { startsWith: 'home.' } } });
  const content: HomeContent = {};
  for (const row of rows) {
    switch (row.key) {
      case 'home.hero':
        content.hero = row.value as any; break;
      case 'home.how':
        content.how = row.value as any; break;
      case 'home.trust':
        content.trust = row.value as any; break;
      case 'home.cities':
        content.cities = row.value as any; break;
    }
  }
  return content;
}

export function t(loc?: Localized, lang: 'ar'|'en'='ar') {
  if(!loc) return '';
  return (lang==='ar'? (loc.ar ?? loc.en) : (loc.en ?? loc.ar)) || '';
}

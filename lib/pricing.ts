import type { CatalogData } from "./catalog";

export type DhabaehSelection = {
  animalId?: string;
  ageId?: string;
  cutPresetId?: string;
  packagingId?: string;
  cookingId?: string;
  sideIds?: string[];
  deliveryTarget?: "HOME"|"HALL";
  cityId?: string; // optional for delivery fee
};

export function deriveWeightAndBand(sel: DhabaehSelection, catalog: CatalogData){
  if(!sel.animalId || !sel.ageId) return { sizeBandId: undefined, estimatedWeightKg: undefined, basePriceModifier:0 };
  const animal = catalog.animals.find(a=>a.id===sel.animalId);
  if(!animal) return { sizeBandId: undefined, estimatedWeightKg: undefined, basePriceModifier:0 };
  const map = catalog.ageWeight.find(m=> m.animalType===animal.code && m.ageId===sel.ageId);
  if(!map) return { sizeBandId: undefined, estimatedWeightKg: undefined, basePriceModifier:0 };
  return { sizeBandId: map.sizeBandId, estimatedWeightKg: map.estimatedWeightKg, basePriceModifier: map.basePriceModifier };
}

export function computeBasePrice(sel: DhabaehSelection, catalog: CatalogData, sizeBandId?:string){
  if(!sel.animalId) return 0;
  const candidates = catalog.basePrices.filter(b=> b.animalId===sel.animalId);
  // scoring: exact age + sizeBand > age only > sizeBand only > base
  let best = 0; let bestScore=-1;
  for(const b of candidates){
    let score=0;
    if(b.ageId && sel.ageId && b.ageId===sel.ageId) score+=2;
    if(b.sizeBandId && sizeBandId && b.sizeBandId===sizeBandId) score+=2;
    if(!b.ageId) score+=0;
    if(!b.sizeBandId) score+=0;
    if(score>bestScore){ bestScore=score; best=b.priceBase; }
  }
  return best;
}

export function computeModifiers(sel: DhabaehSelection, catalog: CatalogData){
  let sum=0;
  if(sel.cutPresetId){ const c=catalog.cutPresets.find(x=>x.id===sel.cutPresetId); if(c) sum+=c.priceModifier; }
  if(sel.packagingId){ const p=catalog.packaging.find(x=>x.id===sel.packagingId); if(p) sum+=p.priceModifier; }
  if(sel.cookingId){ const c=catalog.cooking.find(x=>x.id===sel.cookingId); if(c) sum+=c.priceModifier; }
  if(sel.sideIds){ for(const id of sel.sideIds){ const s=catalog.sides.find(x=>x.id===id); if(s) sum+=s.priceModifier; } }
  return sum;
}

export function computeDeliveryFee(sel: DhabaehSelection, catalog: CatalogData){
  if(!sel.deliveryTarget) return 0;
  // city-specific first
  const cityFee = catalog.deliveryFees.find(f=> f.cityId===sel.cityId && f.target===sel.deliveryTarget);
  if(cityFee) return cityFee.fee;
  const generic = catalog.deliveryFees.find(f=> !f.cityId && f.target===sel.deliveryTarget);
  return generic? generic.fee : 0;
}

export function priceDhabaeh(sel: DhabaehSelection, catalog: CatalogData){
  const { sizeBandId, estimatedWeightKg, basePriceModifier } = deriveWeightAndBand(sel,catalog);
  const base = computeBasePrice(sel,catalog,sizeBandId || undefined) + basePriceModifier;
  const mods = computeModifiers(sel,catalog);
  const delivery = computeDeliveryFee(sel,catalog);
  const subtotal = base + mods + delivery;
  const vat = Math.round(subtotal * (catalog.vatPercent/100));
  const total = subtotal + vat;
  return { sizeBandId, estimatedWeightKg, base, modifiers:mods, delivery, vatPercent: catalog.vatPercent, vat, subtotal, total };
}

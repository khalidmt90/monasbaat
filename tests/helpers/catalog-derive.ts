// phase13: catalog commit helper
export function deriveWeightAndBand(animalId: string, ageId: string, mapping: Array<{
  animalId: string; ageId: string; sizeBandId: string | null; estimatedWeightKg: number; basePriceModifier?: number | null;
}>){
  const row = mapping.find(r => r.animalId === animalId && r.ageId === ageId);
  if(!row) return null;
  return {
    sizeBandId: row.sizeBandId || undefined,
    estimatedWeightKg: row.estimatedWeightKg,
    basePriceModifier: row.basePriceModifier ?? 0,
  };
}

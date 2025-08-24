import { prisma } from "@/lib/prisma";

export type CatalogData = {
  animals: { id:string; code:string; nameAr:string; nameEn?:string|null }[];
  breeds: { id:string; animalId:string; code:string; nameAr:string; nameEn?:string|null }[];
  ages: { id:string; animalId:string; code:string; nameAr:string; nameEn?:string|null }[];
  sizeBands: { id:string; animalId:string; code:string; labelAr:string; labelEn?:string|null; minWeight?:number|null; maxWeight?:number|null }[];
  ageWeight: { animalType:string; ageId:string; sizeBandId?:string|null; estimatedWeightKg:number; basePriceModifier:number }[];
  basePrices: { id:string; animalId:string; ageId?:string|null; sizeBandId?:string|null; priceBase:number }[];
  cutPresets: { id:string; code:string; nameAr:string; priceModifier:number }[];
  packaging: { id:string; code:string; nameAr:string; priceModifier:number }[];
  cooking: { id:string; code:string; nameAr:string; priceModifier:number }[];
  sides: { id:string; code:string; nameAr:string; priceModifier:number }[];
  deliveryFees: { id:string; cityId?:string|null; target:string; fee:number }[];
  vatPercent: number;
};

export async function loadCatalog(): Promise<CatalogData> {
  try {
    const [animals, breeds, ages, sizeBands, ageWeight, basePrices, cutPresets, packaging, cooking, sides, deliveryFees, vatCfg] = await Promise.all([
      prisma.animal.findMany({ where: { active: true }, select:{id:true,code:true,nameAr:true,nameEn:true}}),
      prisma.breed.findMany({ where:{ active:true }, select:{ id:true, animalId:true, code:true, nameAr:true, nameEn:true } }),
  prisma.age.findMany({ where: { active: true }, select:{id:true,animalId:true,code:true,nameAr:true,nameEn:true}}),
      prisma.sizeBand.findMany({ where:{ active:true }, select:{id:true,animalId:true,code:true,labelAr:true,labelEn:true,minWeight:true,maxWeight:true}}),
      prisma.ageWeightMapping.findMany({ select:{animalType:true,ageId:true,sizeBandId:true,estimatedWeightKg:true,basePriceModifier:true}}),
      prisma.basePrice.findMany({ where:{ active:true }, select:{id:true,animalId:true,ageId:true,sizeBandId:true,priceBase:true}}),
  prisma.cutPreset.findMany({ where:{ active:true }, select:{id:true,code:true,nameAr:true,priceModifier:true}}),
  prisma.packagingOption.findMany({ where:{ active:true }, select:{id:true,code:true,nameAr:true,priceModifier:true}}),
  prisma.cookingOption.findMany({ where:{ active:true }, select:{id:true,code:true,nameAr:true,priceModifier:true}}),
  prisma.sideOption.findMany({ where:{ active:true }, select:{id:true,code:true,nameAr:true,priceModifier:true}}),
      prisma.deliveryFee.findMany({ where:{ active:true }, select:{id:true,cityId:true,target:true,fee:true}}),
      prisma.globalConfig.findUnique({ where:{ key:"vat_percent" }})
    ]);
    return {
      animals, breeds, ages, sizeBands, ageWeight, basePrices, cutPresets, packaging, cooking, sides, deliveryFees,
      vatPercent: (() => {
        if (vatCfg?.value && typeof vatCfg.value === 'object') {
          const v = vatCfg.value as unknown as { percent?: unknown };
            if (typeof v.percent === 'number') return v.percent;
        }
        return 15;
      })(),
    };
  } catch {
    throw new Error('catalog_load_failed');
  }
}

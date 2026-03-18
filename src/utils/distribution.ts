/**
 * Fitra Distribution Algorithm for Mosque Management
 * 
 * Logic:
 * 1. Poor families get back 100% of their own Fitra.
 * 2. Rich families' Fitra surplus:
 *    - 10 Anna (62.5%): Distributed equally among poor families.
 *    - 6 Anna (37.5%): Returned to rich families for personal distribution.
 */

export interface Family {
  id: string;
  name: string;
  membersCount: number;
  type: 'rich' | 'poor';
  fitraPaid: number;
  imamSalaryPaid: number;
}

export interface DistributionResult {
  familyId: string;
  familyName: string;
  type: 'rich' | 'poor';
  amountToReceive: number;
  source: 'own_fitra' | 'surplus_10_anna' | 'surplus_6_anna';
}

export function calculateDistribution(families: Family[]): DistributionResult[] {
  const results: DistributionResult[] = [];
  
  const poorFamilies = families.filter(f => f.type === 'poor');
  const richFamilies = families.filter(f => f.type === 'rich');
  
  // 1. Poor families get back 100% of their own Fitra
  poorFamilies.forEach(family => {
    results.push({
      familyId: family.id,
      familyName: family.name,
      type: 'poor',
      amountToReceive: family.fitraPaid,
      source: 'own_fitra'
    });
  });
  
  // 2. Calculate surplus from rich families
  let totalRichFitra = richFamilies.reduce((sum, f) => sum + f.fitraPaid, 0);
  
  const tenAnnaPortion = totalRichFitra * 0.625; // 10/16 = 0.625
  const sixAnnaPortion = totalRichFitra * 0.375; // 6/16 = 0.375
  
  // 3. Distribute 10 Anna equally among poor families
  if (poorFamilies.length > 0) {
    const perPoorFamilySurplus = tenAnnaPortion / poorFamilies.length;
    poorFamilies.forEach(family => {
      results.push({
        familyId: family.id,
        familyName: family.name,
        type: 'poor',
        amountToReceive: perPoorFamilySurplus,
        source: 'surplus_10_anna'
      });
    });
  }
  
  // 4. Return 6 Anna to rich families for personal distribution
  // (Usually proportional to what they paid or equal? The prompt says "Return this portion to the rich families")
  // I'll distribute it proportionally to their contribution.
  if (richFamilies.length > 0) {
    richFamilies.forEach(family => {
      const share = (family.fitraPaid / totalRichFitra) * sixAnnaPortion;
      results.push({
        familyId: family.id,
        familyName: family.name,
        type: 'rich',
        amountToReceive: share,
        source: 'surplus_6_anna'
      });
    });
  }
  
  return results;
}

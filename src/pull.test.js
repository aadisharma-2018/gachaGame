import { describe, expect, it } from 'vitest';
import { resolveRarity } from './pull.js';

describe('resolveRarity', () => {
  it('returns Rare when random value is below 0.1', () => {
    expect(resolveRarity(0)).toEqual({ rarity: 'rare', label: 'Rare' });
    expect(resolveRarity(0.09)).toEqual({ rarity: 'rare', label: 'Rare' });
  });

  it('returns Common when random value is 0.1 or greater', () => {
    expect(resolveRarity(0.1)).toEqual({ rarity: 'common', label: 'Common' });
    expect(resolveRarity(0.5)).toEqual({ rarity: 'common', label: 'Common' });
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetGameState } from './gameState.js';
import {
  STORAGE_KEY,
  applyGameState,
  clearGameState,
  collectGameState,
  getDefaultGameState,
  loadGameState,
  saveGameState,
  validateGameState,
} from './persistence.js';

function createMockStorage() {
  /** @type {Map<string, string>} */
  const store = new Map();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe('persistence', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMockStorage());
    resetGameState();
  });

  describe('getDefaultGameState', () => {
    it('returns a valid default snapshot', () => {
      const defaults = getDefaultGameState();
      expect(validateGameState(defaults)).toEqual(defaults);
      expect(defaults.coins).toBe(10);
      expect(defaults.lastPull).toBeNull();
      expect(defaults.inventory.king).toBe(0);
    });
  });

  describe('validateGameState', () => {
    it('accepts a complete valid snapshot', () => {
      const snapshot = {
        version: 1,
        coins: 7,
        commonCount: 2,
        rareCount: 1,
        inventory: {
          archer: 1,
          swordsman: 0,
          protector: 0,
          mage: 1,
          king: 0,
        },
        lastPull: 'mage',
      };
      expect(validateGameState(snapshot)).toEqual(snapshot);
    });

    it('rejects wrong version', () => {
      const snapshot = getDefaultGameState();
      snapshot.version = 2;
      expect(validateGameState(snapshot)).toBeNull();
    });

    it('rejects negative coins', () => {
      const snapshot = getDefaultGameState();
      snapshot.coins = -1;
      expect(validateGameState(snapshot)).toBeNull();
    });

    it('rejects missing inventory keys', () => {
      const snapshot = getDefaultGameState();
      delete snapshot.inventory.mage;
      expect(validateGameState(snapshot)).toBeNull();
    });

    it('rejects invalid lastPull id', () => {
      const snapshot = getDefaultGameState();
      snapshot.lastPull = 'dragon';
      expect(validateGameState(snapshot)).toBeNull();
    });

    it('rejects non-object input', () => {
      expect(validateGameState(null)).toBeNull();
      expect(validateGameState('bad')).toBeNull();
    });
  });

  describe('loadGameState / saveGameState / clearGameState', () => {
    it('returns null when no saved data exists', () => {
      expect(loadGameState()).toBeNull();
    });

    it('round-trips a saved snapshot', () => {
      const snapshot = getDefaultGameState();
      snapshot.coins = 5;
      snapshot.lastPull = 'archer';
      saveGameState(snapshot);
      expect(loadGameState()).toEqual(snapshot);
    });

    it('returns null for corrupt JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{not json');
      expect(loadGameState()).toBeNull();
    });

    it('returns null for invalid snapshot JSON', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99 }));
      expect(loadGameState()).toBeNull();
    });

    it('clearGameState removes the storage key', () => {
      saveGameState(getDefaultGameState());
      clearGameState();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('collectGameState / applyGameState', () => {
    it('collects current module state including inventory and counters', () => {
      applyGameState({
        ...getDefaultGameState(),
        coins: 3,
        commonCount: 2,
        rareCount: 1,
        inventory: {
          archer: 2,
          swordsman: 0,
          protector: 1,
          mage: 0,
          king: 1,
        },
        lastPull: 'king',
      });

      const collected = collectGameState('king');
      expect(collected.coins).toBe(3);
      expect(collected.commonCount).toBe(2);
      expect(collected.rareCount).toBe(1);
      expect(collected.inventory.archer).toBe(2);
      expect(collected.inventory.protector).toBe(1);
      expect(collected.inventory.king).toBe(1);
      expect(collected.lastPull).toBe('king');
    });

    it('applyGameState hydrates modules and returns last pull card', () => {
      const lastCard = applyGameState({
        ...getDefaultGameState(),
        coins: 4,
        inventory: {
          archer: 1,
          swordsman: 0,
          protector: 0,
          mage: 0,
          king: 0,
        },
        lastPull: 'archer',
      });

      expect(collectGameState(null).coins).toBe(4);
      expect(collectGameState(null).inventory.archer).toBe(1);
      expect(lastCard?.name).toBe('Archer');
    });
  });
});

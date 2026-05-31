import { beforeEach, describe, expect, it } from 'vitest';
import {
  addCoin,
  getCoins,
  getCommonCount,
  getRareCount,
  recordPull,
  resetGameState,
  spendCoin,
} from './gameState.js';

describe('gameState', () => {
  beforeEach(() => {
    resetGameState();
  });

  it('starts with 10 coins and zero counters after reset', () => {
    expect(getCoins()).toBe(10);
    expect(getCommonCount()).toBe(0);
    expect(getRareCount()).toBe(0);
  });

  it('spendCoin decreases balance by 1 when coins available', () => {
    expect(spendCoin()).toBe(true);
    expect(getCoins()).toBe(9);
  });

  it('spendCoin fails at 0 coins', () => {
    for (let i = 0; i < 10; i += 1) {
      spendCoin();
    }
    expect(getCoins()).toBe(0);
    expect(spendCoin()).toBe(false);
    expect(getCoins()).toBe(0);
  });

  it('addCoin increases balance by 1', () => {
    addCoin();
    expect(getCoins()).toBe(11);
  });

  it('recordPull increments common counter', () => {
    recordPull('common');
    expect(getCommonCount()).toBe(1);
    expect(getRareCount()).toBe(0);
  });

  it('recordPull increments rare counter', () => {
    recordPull('rare');
    expect(getRareCount()).toBe(1);
    expect(getCommonCount()).toBe(0);
  });
});

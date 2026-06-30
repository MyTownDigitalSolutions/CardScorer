import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addRound, createMatch, getLeaders, hasWinner } from '../src/scoring.js';

test('Farkle rounds add turn scores and zero out farkles', () => {
  let match = createMatch('farkle', ['Ava', 'Ben']);
  match = addRound(match, {
    Ava: { turnScore: 550, farkle: false },
    Ben: { turnScore: 1000, farkle: true }
  });
  assert.equal(match.scores.Ava, 550);
  assert.equal(match.scores.Ben, 0);
});

test('Canasta totals melds, bonuses, and penalties', () => {
  let match = createMatch('canasta', ['North']);
  match = addRound(match, {
    North: { meldPoints: 1200, redThrees: 300, canastas: 800, penalties: 200 }
  });
  assert.equal(match.scores.North, 2100);
});

test('Mille Bornes applies distance and bonus scoring', () => {
  let match = createMatch('mille-bornes', ['Blue']);
  match = addRound(match, {
    Blue: { distance: 1000, safeties: 2, coupFourres: 1, tripComplete: true, delayedAction: 300 }
  });
  assert.equal(match.scores.Blue, 2200);
});

test('leaders and winners are derived from target scores', () => {
  const match = { ...createMatch('farkle', ['A', 'B']), scores: { A: 10000, B: 8000 } };
  assert.deepEqual(getLeaders(match), ['A']);
  assert.equal(hasWinner(match), true);
});

import { getGameDefinition } from './games.js';

export function createMatch(gameId, players) {
  const cleanPlayers = players.map((name) => name.trim()).filter(Boolean);
  if (cleanPlayers.length < 1) throw new Error('Add at least one player or team.');
  const game = getGameDefinition(gameId);
  return {
    gameId,
    players: cleanPlayers,
    scores: Object.fromEntries(cleanPlayers.map((player) => [player, 0])),
    rounds: [],
    targetScore: game.targetScore
  };
}

export function addRound(match, entries) {
  const game = getGameDefinition(match.gameId);
  const roundNumber = match.rounds.length + 1;
  const round = { number: roundNumber, entries: [] };
  const scores = { ...match.scores };

  for (const player of match.players) {
    const values = entries[player] || {};
    const points = game.calculate(values);
    scores[player] += points;
    round.entries.push({ player, values, points, summary: game.summary(values) });
  }

  return { ...match, scores, rounds: [...match.rounds, round] };
}

export function getLeaders(match) {
  const highScore = Math.max(...Object.values(match.scores));
  return Object.entries(match.scores)
    .filter(([, score]) => score === highScore)
    .map(([player]) => player);
}

export function hasWinner(match) {
  return Object.values(match.scores).some((score) => score >= match.targetScore);
}

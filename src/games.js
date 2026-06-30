export const gameDefinitions = [
  {
    id: 'farkle',
    name: 'Farkle',
    targetScore: 10000,
    scoreMode: 'add',
    fields: [
      { id: 'turnScore', label: 'Turn score', type: 'number', min: 0, step: 50, defaultValue: 0 },
      { id: 'farkle', label: 'Farkle (zero this turn)', type: 'checkbox', defaultValue: false }
    ],
    calculate: ({ turnScore, farkle }) => (farkle ? 0 : Number(turnScore || 0)),
    summary: (values) => values.farkle ? 'Farkle' : `${Number(values.turnScore || 0).toLocaleString()} points`
  },
  {
    id: 'canasta',
    name: 'Canasta',
    targetScore: 5000,
    scoreMode: 'add',
    fields: [
      { id: 'meldPoints', label: 'Card and meld points', type: 'number', defaultValue: 0 },
      { id: 'redThrees', label: 'Red threes bonus', type: 'number', defaultValue: 0 },
      { id: 'canastas', label: 'Canasta bonuses', type: 'number', defaultValue: 0 },
      { id: 'penalties', label: 'Penalties', type: 'number', defaultValue: 0 }
    ],
    calculate: ({ meldPoints, redThrees, canastas, penalties }) =>
      Number(meldPoints || 0) + Number(redThrees || 0) + Number(canastas || 0) - Number(penalties || 0),
    summary: (values) => `Meld ${values.meldPoints || 0}, bonuses ${Number(values.redThrees || 0) + Number(values.canastas || 0)}, penalties ${values.penalties || 0}`
  },
  {
    id: 'mille-bornes',
    name: 'Mille Bornes',
    targetScore: 5000,
    scoreMode: 'add',
    fields: [
      { id: 'distance', label: 'Distance cards', type: 'number', min: 0, max: 1000, defaultValue: 0 },
      { id: 'safeties', label: 'Safety cards (100 each)', type: 'number', min: 0, defaultValue: 0 },
      { id: 'coupFourres', label: 'Coup fourrés (300 each)', type: 'number', min: 0, defaultValue: 0 },
      { id: 'tripComplete', label: 'Trip completed bonus', type: 'checkbox', defaultValue: false },
      { id: 'delayedAction', label: 'Delayed action / safe trip / shutout bonuses', type: 'number', defaultValue: 0 }
    ],
    calculate: ({ distance, safeties, coupFourres, tripComplete, delayedAction }) =>
      Number(distance || 0) + Number(safeties || 0) * 100 + Number(coupFourres || 0) * 300 + (tripComplete ? 400 : 0) + Number(delayedAction || 0),
    summary: (values) => `Distance ${values.distance || 0}, safety bonuses ${(Number(values.safeties || 0) * 100) + (Number(values.coupFourres || 0) * 300)}, other bonuses ${(values.tripComplete ? 400 : 0) + Number(values.delayedAction || 0)}`
  }
];

export function getGameDefinition(id) {
  const game = gameDefinitions.find((definition) => definition.id === id);
  if (!game) throw new Error(`Unknown game: ${id}`);
  return game;
}

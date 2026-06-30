import { gameDefinitions, getGameDefinition } from './games.js';
import { addRound, createMatch, getLeaders, hasWinner } from './scoring.js';

const gameSelect = document.querySelector('#game-select');
const playersInput = document.querySelector('#players-input');
const startButton = document.querySelector('#start-game');
const newGameButton = document.querySelector('#new-game');
const scoreboard = document.querySelector('#scoreboard');
const roundEntry = document.querySelector('#round-entry');
const history = document.querySelector('#history');
let match;

gameSelect.innerHTML = gameDefinitions
  .map((game) => `<option value="${game.id}">${game.name} — plays to ${game.targetScore.toLocaleString()}</option>`)
  .join('');

startButton.addEventListener('click', () => {
  try {
    match = createMatch(gameSelect.value, playersInput.value.split(','));
    render();
  } catch (error) {
    alert(error.message);
  }
});

newGameButton.addEventListener('click', () => {
  match = undefined;
  [scoreboard, roundEntry, history].forEach((element) => element.classList.add('hidden'));
});

function render() {
  renderScoreboard();
  renderRoundEntry();
  renderHistory();
  [scoreboard, roundEntry, history].forEach((element) => element.classList.remove('hidden'));
}

function renderScoreboard() {
  const game = getGameDefinition(match.gameId);
  const leaders = getLeaders(match);
  const winnerText = hasWinner(match) ? `<p class="winner">Winner: ${leaders.join(', ')}</p>` : '';
  scoreboard.innerHTML = `
    <div class="section-heading"><h2>${game.name} scoreboard</h2><span>Goal: ${match.targetScore.toLocaleString()}</span></div>
    ${winnerText}
    <div class="scores">
      ${match.players.map((player) => `
        <article class="score-card ${leaders.includes(player) ? 'leader' : ''}">
          <span>${player}</span>
          <strong>${match.scores[player].toLocaleString()}</strong>
        </article>`).join('')}
    </div>`;
}

function renderRoundEntry() {
  const game = getGameDefinition(match.gameId);
  roundEntry.innerHTML = `
    <div class="section-heading"><h2>Add round ${match.rounds.length + 1}</h2><span>${game.name}</span></div>
    <form id="round-form" class="round-form">
      ${match.players.map((player) => playerFields(player, game)).join('')}
      <button type="submit">Save round</button>
    </form>`;
  document.querySelector('#round-form').addEventListener('submit', saveRound);
}

function playerFields(player, game) {
  return `<fieldset><legend>${player}</legend>${game.fields.map((field) => `
    <label class="${field.type === 'checkbox' ? 'checkbox' : ''}">
      ${field.label}
      <input name="${player}::${field.id}" type="${field.type}" ${field.type === 'checkbox' ? '' : `value="${field.defaultValue ?? 0}"`} ${field.min !== undefined ? `min="${field.min}"` : ''} ${field.max !== undefined ? `max="${field.max}"` : ''} ${field.step !== undefined ? `step="${field.step}"` : ''} />
    </label>`).join('')}</fieldset>`;
}

function saveRound(event) {
  event.preventDefault();
  const game = getGameDefinition(match.gameId);
  const data = new FormData(event.currentTarget);
  const entries = {};
  for (const player of match.players) {
    entries[player] = {};
    for (const field of game.fields) {
      const key = `${player}::${field.id}`;
      entries[player][field.id] = field.type === 'checkbox' ? data.has(key) : Number(data.get(key) || 0);
    }
  }
  match = addRound(match, entries);
  render();
}

function renderHistory() {
  history.innerHTML = `
    <div class="section-heading"><h2>Round history</h2><span>${match.rounds.length} saved</span></div>
    ${match.rounds.length === 0 ? '<p class="empty">No rounds yet.</p>' : match.rounds.toReversed().map((round) => `
      <article class="round"><h3>Round ${round.number}</h3>
        <ul>${round.entries.map((entry) => `<li><strong>${entry.player}</strong>: ${entry.points.toLocaleString()} — ${entry.summary}</li>`).join('')}</ul>
      </article>`).join('')}`;
}

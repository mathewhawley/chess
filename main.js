const mountNode = document.getElementById('board')
const cellTemplate = document.getElementById('cell-template').innerHTML

/**
 * Set up
 * ========================================================================== */

function buildUnitRow(player, pawn = false) {
  if (pawn) {
    return _.times(8, () => `${player}-p`)
  }
  const units = ['r', 'kn', 'b', 'q', 'k', 'b', 'kn', 'r']
  return units.map(unit => `${player}-${unit}`)
}

function buildEmptyRows() {
  return _.times(4, () => _.times(8, () => 'empty'))
}

function createBoard() {
  return [
    buildUnitRow('b'),
    buildUnitRow('b', true),
    ...buildEmptyRows(),
    buildUnitRow('w', true),
    buildUnitRow('w')
  ]
}

function render(board) {
  let html = ''
  _.forEach(board, (row, i) => {
    _.forEach(row, (col, j) => {
      const color = (i + j) % 2 ? 'black' : 'white'
      const compiled = _.template(cellTemplate)({
        row: i,
        col: j,
        color: color,
        unit: col
      })
      html = html + compiled
    })
  })
  mountNode.innerHTML = html
}

function addEventListeners(state) {
  const cells = Array.from(document.getElementsByClassName('cell'))
  _.forEach(cells, cell => {
    cell.addEventListener('click', handleSelect.bind(null, state))
  })
}

function getCoords(element) {
  return [
    parseInt(element.dataset.row, 10),
    parseInt(element.dataset.col, 10),
  ]
}

function handleSelect(state, event) {
  const { target } = event
  const coords = getCoords(target)
  if (!isInitialSelection(state)) {
    if (isPlayerUnit(state, coords)) {
      setOrigin(state, coords, target)
    }
  } else {
    if (isOrigin(state, coords)) {
      redraw(state)
    } else {
      if (isLegal(state, coords)) {
        moveUnit(state, coords)
      }
    }
  }
}

/**
 * State checks
 * ========================================================================== */

function isInitialSelection(state) {
  return state.origin.length
}

function isPlayerUnit(state, origin) {
  const row = state.board[origin[0]]
  const cell = row[origin[1]]
  const player = cell.split('-')[0]
  return player === state.turn
}

function isOrigin(state, dest) {
  const sameCol = state.origin[0] === dest[0]
  const sameRow = state.origin[1] === dest[1]
  return sameCol && sameRow
}

/**
 * State changes
 * ========================================================================== */

function setOrigin(state, origin, target) {
  target.classList.add('cell--origin')
  state.origin = origin
}

function redraw(state) {
  state.origin = []
  render(state.board)
  addEventListeners(state)
}

function setDestCell(state, coords) {
  state.board[coords[0]][coords[1]] = state.board[state.origin[0]][state.origin[1]]
}

function clearOriginCell(state) {
  state.board[state.origin[0]][state.origin[1]] = 'empty'
}

function endTurn(state) {
  state.turn = state.turn === 'b' ? 'w' : 'b'
}

function moveUnit(state, coords) {
  setDestCell(state, coords)
  clearOriginCell(state)
  redraw(state)
  endTurn(state)
}

/**
 * Move checks
 * ========================================================================== */

function isLegal(state, dest) {
  return (
    kingThreat(state, dest) &&
    !isPlayerUnit(state, dest) &&
    validMove(state, dest) &&
    otherChecks(state, dest)
  )
}

function kingThreat(state, dest) {
  return true
}

function validMove(state, dest) {
  const row = state.board[state.origin[0]]
  const cell = row[state.origin[1]]
  switch(true) {
    case cell === 'b-r' || cell === 'w-r':
      return validRookMove(state, dest)
    case cell === 'b-kn' || cell === 'w-kn':
      return validKnightMove(state, dest)
    case cell === 'b-b' || cell === 'w-b':
      return validBishopMove(state, dest)
    case cell === 'b-q' || cell === 'w-q':
      return validQueenMove(state, dest)
    case cell === 'b-k' || cell === 'w-k':
      return validKingMove(state, dest)
    case cell === 'b-p':
      return validBlackPawnMove(state, dest)
    case cell === 'w-p':
      return validWhitePawnMove(state, dest)
    default:
      return;
  }
}

function otherChecks(state, dest){
  return true
}

/**
 * Boot up
 * ========================================================================== */

function init() {
  const state = {
    board: createBoard(),
    origin: [],
    turn: 'w'
  }
  render(state.board)
  addEventListeners(state)
}

init()
const mountNode = document.getElementById('board')
const cellTemplate = document.getElementById('cell-template').innerHTML

const state = {
  board: [],
  origin: [],
  dest: [],
  turn: 'w',
  old_en_passant: [],
  new_en_passant: []
}

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

function render() {
  let html = ''
  _.forEach(state.board, (row, i) => {
    _.forEach(row, (col, j) => {
      const color = (i + j) % 2 ? 'black' : 'white'
      const compiled = _.template(cellTemplate)({
        row: i,
        col: j,
        color: color,
        unit: col.split('-')[1],
        player: col.split('-')[0]
      })
      html = html + compiled
    })
  })
  mountNode.innerHTML = html
}

function addEventListeners() {
  const cells = Array.from(document.getElementsByClassName('cell'))
  _.forEach(cells, cell => {
    cell.addEventListener('click', handleSelect)
  })
}

function getCoords(element) {
  return [
    parseInt(element.dataset.row, 10),
    parseInt(element.dataset.col, 10),
  ]
}

function handleSelect(event) {
  const { target } = event
  if (!isInitialSelection()) {
    if (isPlayerUnit(target)) {
      setOrigin(target)
    }
  } else {
    setDest(target)
    if (isOrigin()) {
      redraw()
    } else {
      if (isLegal(target)) {
        moveUnit(target)
      }
    }
  }
}

/**
 * State checks
 * ========================================================================== */

function isInitialSelection() {
  return state.origin.length
}

function isPlayerUnit(target) {
  return target.dataset.player === state.turn
}

function isOrigin() {
  const sameCol = state.origin[0] === state.dest[0]
  const sameRow = state.origin[1] === state.dest[1]
  return sameCol && sameRow
}

/**
 * State changes
 * ========================================================================== */

function setOrigin(target) {
  target.classList.add('cell--origin')
  state.origin = getCoords(target)
}

function setDest(target) {
  state.dest = getCoords(target)
}

function redraw() {
  state.origin = []
  state.dest = []
  render(state.board)
  addEventListeners()
}

function setDestCell() {
  //Check if white pawn has reached final rank, if so promote to queen
  if(enPassantCheck()){
    if(state.dest[0] ===5){
      state.board[4][state.dest[1]]='empty'
    }else{
      state.board[3][state.dest[1]]='empty'
    }
  }
  if(state.dest[0]==0 && state.board[state.origin[0]][state.origin[1]] ==='w-p'){
    state.board[state.dest[0]][state.dest[1]]  = 'w-q';  
  }
  //Same check for black pawn
  else if (state.dest[0]==7 && state.board[state.origin[0]][state.origin[1]] ==='b-p'){
    state.board[state.dest[0]][state.dest[1]] = 'b-q';
  }
  //Else, set destination cell as original piece
  else{
    state.board[state.dest[0]][state.dest[1]] = state.board[state.origin[0]][state.origin[1]];
  }
}

function clearOriginCell() {
  state.board[state.origin[0]][state.origin[1]] = 'empty';
}

function endTurn() {
  state.turn = state.turn === 'b' ? 'w' : 'b';
  //update en_passant placeholders
  state.old_en_passant = state.new_en_passant;
  state.new_en_passant = [];
}

function moveUnit() {
  setDestCell()
  clearOriginCell()
  redraw()
  endTurn()
}

/**
 * Move checks
 * ========================================================================== */

function isLegal(target) {
  return (
    kingThreat(target) &&
    !isPlayerUnit(target) &&
    validMove(target) &&
    otherChecks(target)
  )
}

function kingThreat(target) {
  return true
}

function validMove(target) {
  if (isPlayerUnit(target)) {
    return false
  }

  const row = state.board[state.origin[0]]
  const cell = row[state.origin[1]]

  switch(true) {
    case cell === 'b-r' || cell === 'w-r':
      return validRookMove()
    case cell === 'b-kn' || cell === 'w-kn':
      return validKnightMove()
    case cell === 'b-b' || cell === 'w-b':
      return validBishopMove()
    case cell === 'b-q' || cell === 'w-q':
      return validQueenMove()
    case cell === 'b-k' || cell === 'w-k':
      return validKingMove()
    case cell === 'b-p':
      return validBlackPawnMove()
    case cell === 'w-p':
      return validWhitePawnMove()
    default:
      return;
  }
}

function otherChecks(target){
  return true
}

/**
 * Boot up
 * ========================================================================== */

function init() {
  state.board = createBoard()
  render()
  addEventListeners()
}

init()
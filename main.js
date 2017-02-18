const mountNode = document.getElementById('board')
const cellTemplate = document.getElementById('cell-template').innerHTML
const currentState = {
  board: [],
  origin: [],
  dest: [],
  turn: 'w',
  old_en_passant: [],
  new_en_passant: [],
  blackKingPos: [0, 4],
  whiteKingPos: [7, 4],
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

function createBoard(state) {
  state.board = [
    buildUnitRow('b'),
    buildUnitRow('b', true),
    ...buildEmptyRows(),
    buildUnitRow('w', true),
    buildUnitRow('w')
  ]
}

function render(state) {
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
  if (!isInitialSelection(state)) {
    if (isOwnUnit(state,target)) {
      setOrigin(state, target)
    }
  } else {
    setDest(state, target)
    if (isOrigin(state)) {
      redraw(state)
    } else {
      if (isLegal(state)) {
        moveUnit(state)
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

function isOwnUnit(state,target) {
  return target.dataset.player === state.turn
}

function takingOwnUnit(state){
  return state.turn === state.board[state.dest[0]][state.dest[1]][0]
}

function isOrigin(state) {
  const sameCol = state.origin[0] === state.dest[0]
  const sameRow = state.origin[1] === state.dest[1]
  return sameCol && sameRow
}

/**
 * State changes
 * ========================================================================== */

function setOrigin(state, target) {
  target.classList.add('cell--origin')
  state.origin = getCoords(target)
}

function setDest(state, target) {
  state.dest = getCoords(target)
}

function redraw(state) {
  state.origin = []
  state.dest = []
  render(state)
  addEventListeners(state)
}

function setDestCell(state) {
  //Check if white pawn has reached final rank, if so promote to queen
  if(enPassantCheck(state)){
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

function clearOriginCell(state) {
  state.board[state.origin[0]][state.origin[1]] = 'empty';
}

function endTurn(state) {
  state.turn = state.turn === 'b' ? 'w' : 'b';
  //update en_passant placeholders
  state.old_en_passant = state.new_en_passant;
  state.new_en_passant = [];
}

function moveUnit(state) {
  setDestCell(state)
  clearOriginCell(state)
  redraw(state)
  endTurn(state)
}

/**
 * Move checks
 * ========================================================================== */

function isLegal(state) {
  return (
    !futureKingThreat(state) &&
    validMove(state) &&
    !takingOwnUnit(state)
  )
}

function futureKingThreat(state){
  let stateClone = _.cloneDeep(state)
  setDestCell(stateClone)
  clearOriginCell(stateClone)
  endTurn(stateClone)
  return kingThreat(stateClone)
}

function kingThreat(state) {
  let kingNode
  let kingPos
  let isKingThreat = false
  if (state.turn === 'b') {
    kingPos = state.whiteKingPos
    kingNode = document.querySelectorAll(`[data-player='w'][data-row='${kingPos[0]}'][data-col='${kingPos[1]}']`)[0]
  } else {
    kingPos = state.blackKingPos
    kingNode = document.querySelectorAll(`[data-player='b'][data-row='${kingPos[0]}'][data-col='${kingPos[1]}']`)[0]
  }
  _.forEach(state.board, (row, i) => {
    _.forEach(row, (col, j) => {
      let stateClone = _.cloneDeep(state)

      stateClone.origin = [i, j]
      stateClone.dest = kingPos
      if (validMove(stateClone, kingNode) && state.turn === stateClone.board[i][j][0]) {
        isKingThreat = true
      }
    })
  })
  return isKingThreat
}

function validMove(state) {
  const row = state.board[state.origin[0]]
  const cell = row[state.origin[1]]

  switch(true) {
    case cell === 'b-r' || cell === 'w-r':
      return validRookMove(state)
    case cell === 'b-kn' || cell === 'w-kn':
      return validKnightMove(state)
    case cell === 'b-b' || cell === 'w-b':
      return validBishopMove(state)
    case cell === 'b-q' || cell === 'w-q':
      return validQueenMove(state)
    case cell === 'b-k' || cell === 'w-k':
      return validKingMove(state)
    case cell === 'b-p':
      return validBlackPawnMove(state)
    case cell === 'w-p':
      return validWhitePawnMove(state)
    default:
      return;
  }
}

/**
 * Boot up
 * ========================================================================== */

function init(state) {
  createBoard(state)
  render(state)
  addEventListeners(state)
}

init(currentState)
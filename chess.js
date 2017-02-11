const mountNode = document.getElementById('board')
const cellTemplate = document.getElementById('cell-template').innerHTML

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

function isInitialSelection(state) {
  return state.origin.length
}

function isPlayerUnit(state, origin) {
  const row = state.board[origin[0]]
  const cell = row[origin[1]]
  const prefix = cell.split('-')[0]
  return prefix === state.turn
}

function isOrigin(state, dest) {
  const sameCol = state.origin[0] === dest[0]
  const sameRow = state.origin[1] === dest[1]
  return sameCol && sameRow
}

function setOrigin(state, origin, target) {
  target.classList.add('cell--origin')
  state.origin = origin
}

function redraw(state) {
  state.origin = []
  render(state.board)
  addEventListeners(state)
}

function isLegal(state, dest) {
  return (
    kingThreat(state, dest) &&
    !isPlayerUnit(state, dest) &&
    validMove(state, dest) &&
    otherChecks(state, dest)
  )
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

function getCoords(element) {
  return element
    .getAttribute('id')
    .split('-')
    .map(str => parseInt(str, 10))
}

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

function kingThreat(state, dest) {
  return true
}

function noVerticalJump(state, dest){
  console.log(state.origin[0], dest[0])
  if (state.origin[0] > dest[0]) {
    for(var i=dest[0]+1; i < state.origin[0]; i++){
        console.log(i)
        console.log(dest[1])
        console.log(state.board[i][dest[1]])
      if(state.board[i][dest[1]]!='empty'){
        return false;
      }
    }
  }
  else{
    for(var i=state.origin[0]+1; i < dest[0]; i++){
      if(state.board[i][dest[1]]!='empty'){
        return false;
      }
    }
  }
  return true;
}

function noHorizontalJump(state, dest){
  if (state.origin[1] > dest[1]) {
    console.log(state.origin[1],dest[1])
    for(var i=dest[1]+1; i < state.origin[1]; i++){
      console.log(i)
      if(state.board[dest[0]][i]!='empty'){
        return false;
      }
    }
  }
  else{
    console.log('check horizontal left')
    for(var i=state.origin[1]+1; i < dest[1]; i++){
      if(state.board[dest[0]][i]!='empty'){
        return false;
      }
    }
  }
  return true;
}

function noDiagonalJump(state, dest){
  if(dest[0]< state.origin[0] && dest[1] <  state.origin[1]){
    for(var i= 1; i < state.origin[0] - dest[0]; i++){
      if(state.board[dest[0]+i][dest[1]+i]!='empty'){
        return false;
      }
    }
  }
  else if(dest[0]< state.origin[0] && dest[1] <  state.origin[1]){
    for(var i= 1; i < dest[0] - state.origin[0]; i++){
      if(state.board[state.origin[0]+i][state.origin[1]+i]!='empty'){
        return false;
      }
    }
  }
  else{
    return true;
  }
  // else if(dest[0]< state.origin[0] && dest[1] >  state.origin[1]){
  //   for(var i= 1; i < dest[0] - state.origin[0]; i++){
  //     if(state.board[state.origin[0]+i][state.origin[1]+i]!='empty'){
  //       return false;
  //     }
  //   }
  // }
  // else{
  //   for(var i= 1; i < dest[0] - state.origin[0]; i++){
  //     if(state.board[state.origin[0]+i][state.origin[1]+i]!='empty'){
  //       return false;
  //     }
  //   }
  // }
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

function validRookMove(state, dest){
  if(isPlayerUnit(state, dest)){
    return false;
  }
  else if (state.origin[0] != dest[0] && state.origin[1] != dest[1]){
    return false
  }
  else if (state.origin[0] == dest[0]){
    return noHorizontalJump(state, dest);
  }
  else{
    return noVerticalJump(state, dest);
  }
}

function validKnightMove(state, dest){
  var distOne = Math.abs(state.origin[0]-dest[0]);
  var distTwo = Math.abs(state.origin[1]-dest[1]);
  return Math.max(distOne,distTwo) === 2 && Math.min(distOne, distTwo) ===1 ;
}

function validBishopMove(state, dest){
  if (isPlayerUnit(state, dest)) {
    return false
  } else if (Math.abs(state.origin[0]-dest[0]) === Math.abs(state.origin[1]-dest[1])){
    return noDiagonalJump(state, dest);
  }
  else{
    return false;
  }
}


function validKingMove(state, dest){
  if(isPlayerUnit(state, dest)){
    return false;
  } else if (Math.abs(state.origin[0]-dest[0]) >1) {
    return false;
  } else if (Math.abs(state.origin[1]-dest[1]) >1) {
    return false;
  } else {
    return true
  }
}

function validQueenMove(state, dest){
  return true
}

function validBlackPawnMove(state, dest){
  return true
}

function validWhitePawnMove(state, dest){
  return true
}

function otherChecks(state, dest){
  return true
}

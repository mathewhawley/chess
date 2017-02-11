const createBoard = () => {
  const board = [
    ['br','bkn','bb','bq','bk','bb','bkn','br'],
    _.times(8, () => 'bp'),
    _.times(8, () => 'empty'),
    _.times(8, () => 'empty'),
    _.times(8, () => 'empty'),
    _.times(8, () => 'empty'),
    _.times(8, () => 'wp'),
    ['wr','wkn','wb','wq','wk','wb','wkn','wr'],
  ]
  return board
}

const board = createBoard()

const state = {
  board: board,
  origin: [],
  turn: 'w'
}



const render = (board) => {
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      const color = (i + j) % 2 ? 'black' : 'white'
      const html = `<div id="${i}-${j}" class="cell cell--${color} cell--${cell}"></div>`
      $(html).appendTo('#board')
    })
  })
}

render(board)

const getdest = (el) => {
  return $(el).attr('id').toString().split('-').map(i => parseInt(i, 10))
}

function isLegal(state, dest) {
  return kingThreat(state, dest) && takeOwnPiece(state, dest) && validPieceMove(state, dest) && otherChecks(state, dest);
}

function kingThreat(state, dest) {
  return true
}

function takeOwnPiece(state, dest) {
  return state.board[dest[0]][dest[1]][0] !== state.turn
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
  return true;
}

function validPieceMove(state, dest) {
  const piece = state.board[state.origin[0]][state.origin[1]]
  if (piece === 'br' || piece === 'wr') return validRookMove(state, dest)
  else if (piece === 'bkn' || piece === 'wkn') return validKnightMove(state, dest)
  else if (piece === 'bb' || piece === 'wb') return validBishopMove(state, dest)
  else if (piece === 'bq' || piece === 'wq') return validQueenMove(state, dest)
  else if (piece === 'bk' || piece === 'wk') return validKingMove(state, dest)
  else if (piece === 'bp') return validBlackPawnMove(state, dest)
  else if (piece === 'wp') return validWhitePawnMove(state, dest)
}

function validRookMove(state, dest){
  if(state.origin[0] == dest[0] && state.origin[1] == dest[1]){
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
  return true
}

function validBishopMove(state, dest){
  return true
}

function validKingMove(state, dest){
  return true
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

function otherChecks(state, dest) {
  return true
}



$('#board').on('click', '.cell', event => {
  if (!state.origin.length) {
    const dest = getdest(event.target)
    if (state.board[dest[0]][dest[1]][0]== state.turn) {
      $(event.target).addClass('cell--origin');
      state.origin = dest;
    }
  } else {
    const dest2 = getdest(event.target);
    if (isLegal(state, dest2)) {
      state.board[dest2[0]][dest2[1]] = state.board[state.origin[0]][state.origin[1]];
      state.board[state.origin[0]][state.origin[1]]='empty';
      $('#board').empty();
      state.origin = [];
      render(state.board)
      state.turn = state.turn === 'b' ? 'w' : 'b'
    }
  }
})


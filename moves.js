//All functions in this file are used to check if candidate moves are valid.

//nojump helper functions check that the candidate move does not involve an illegal 'jump' over non-empty squares
function noVerticalJump(state){
  //if moving forward
  if (state.origin[0] > state.dest[0]) {
    for(var i=state.dest[0]+1; i < state.origin[0]; i++){
      //return false if any cells between origin and destination are not empty
      if(state.board[i][state.dest[1]]!='empty'){
        return false;
      }
    }
  }
  //same for moving backwards
  else{
    for(var i=state.origin[0]+1; i < state.dest[0]; i++){
      if(state.board[i][state.dest[1]]!='empty'){
        return false;
      }
    }
  }
  //after perfoming either test, if all cells are empty, return true
  return true;
}

//same as above for horizontal moves
function noHorizontalJump(state){
  if (state.origin[1] > state.dest[1]) {
    for(var i=state.dest[1]+1; i < state.origin[1]; i++){
      if(state.board[state.dest[0]][i]!='empty'){
        return false;
      }
    }
  }
  else{
    for(var i=state.origin[1]+1; i < state.dest[1]; i++){
      if(state.board[state.dest[0]][i]!='empty'){
        return false;
      }
    }
  }
  return true;
}

//Loops through squares connecting origin and destination and checks for non-empty squares.
function noDiagonalJump(state){
  //Are the x coordinates increasing from origin --> destination?
  const verticalDirection = state.dest[0]< state.origin[0] ? 1 : -1;
  //Are the y coordinates increasing from origin --> destination?
  const horizontalDirection =  state.dest[1]< state.origin[1] ? 1 : -1;
  for(var i= 1; i < state.origin[0] - state.dest[0]; i++){
    //move one step in the horizontal and vertical direction from origin to destination
    if(state.board[state.origin[0]-i*verticalDirection][state.origin[1]-i*horizontalDirection]!='empty'){
    //if nonempty, return false
      return false;
    }
  }
  return true;
}

//helper function checking if destination square is equal to en-passant placeholder
function enPassantCheck(state){
  return state.dest[0] === state.old_en_passant[0] && state.dest[1]===state.old_en_passant[1]
}

function validRookMove(state) {
  //Piece cannot have changed both row and column
  if (state.origin[0] !== state.dest[0] && state.origin[1] !== state.dest[1]) {
    return false;
  //Cannot have jumped over any pieces
  } else if (state.origin[0] === state.dest[0]) {
    return noHorizontalJump(state);
  } else {
    return noVerticalJump(state);
  }
}

function validKnightMove(state) {
  var distOne = Math.abs(state.origin[0] - state.dest[0]);
  var distTwo = Math.abs(state.origin[1] - state.dest[1]);
  //minimum distance between starting and ending square == 1 and maximum == 2 (moved in 2x1 l shape)
  return Math.max(distOne,distTwo) === 2 && Math.min(distOne, distTwo) ===1 ;
}

function validBishopMove(state){
  //Absolute difference between origin and destination columns and rows must be the same (diagonal move)
  if (Math.abs(state.origin[0] - state.dest[0]) === Math.abs(state.origin[1] - state.dest[1])){
    //piece cannot have 'jumped' over non-empty squares
    return noDiagonalJump(state);
  }
  else{
    return false;
  }
}

//King cannot have moved more than 1 square in other directions.
function validKingMove(state){
  if ((Math.abs(state.origin[0] - state.dest[0]) < 2) && (Math.abs(state.origin[1] - state.dest[1]) < 2)) {
    if (state.turn === 'w') {
      state.whiteKingPos = state.dest
    } else {
      state.blackKingPos = state.dest
    }
    return true
  } else {
    return false
  }
}

//Reusing bishop and rook functions.
function validQueenMove(state){
  return validBishopMove(state) || validRookMove(state);
}

function validBlackPawnMove(state){
  if(state.origin[0]-state.dest[0] === -1 && state.dest[1] === state.origin[1] && state.board[state.dest[0]][state.dest[1]]==='empty'){
    return true;
  }
  if(state.origin[0]-state.dest[0] === -1 && Math.abs(state.dest[1]-state.origin[1]) ===1 && (state.board[state.dest[0]][state.dest[1]][0]==='w'|| enPassantCheck(state))){
    return true;
  }
  if(state.origin[0]== 1 && state.dest[0] == 3 && state.dest[1] === state.origin[1] && state.board[state.dest[0]][state.dest[1]]==='empty'){
    state.new_en_passant =[2,state.dest[1]]
    return true;
  }
  return false;
}

function validWhitePawnMove(state){
  //moved 1 forward to empty square
  if(state.origin[0]-state.dest[0] === 1 && state.dest[1] === state.origin[1] && state.board[state.dest[0]][state.dest[1]]==='empty'){
    return true;
  }
  //moved 1 forward, 1 diagonal and captured piece
  if(state.origin[0]-state.dest[0] === 1 && Math.abs(state.dest[1]-state.origin[1]) ===1 && (state.board[state.dest[0]][state.dest[1]][0]==='b'|| enPassantCheck(state))){
    return true;
  }

  //moved two forward from starting row
  if(state.origin[0]== 6 && state.dest[0] == 4 && state.dest[1] === state.origin[1] && state.board[state.dest[0]][state.dest[1]]==='empty'){
    state.new_en_passant =[5,state.dest[1]]
    return true;
  }
  return false;
}


//All functions in this file are used to check if candidate moves are valid. 

//nojump helper functions check that the candidate move does not involve an illegal 'jump' over non-empty squares
function noVerticalJump(){
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
function noHorizontalJump(){
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

//Hard to read. Loops through squares connecting origin and destination and checks for non-empty squares, according to for different cases.  
function noDiagonalJump(){
  if(state.dest[0]< state.origin[0] && state.dest[1] <  state.origin[1]){
    for(var i= 1; i < state.origin[0] - state.dest[0]; i++){
      if(state.board[state.origin[0]-i][state.origin[1]-i]!='empty'){
        return false;
      }
    }
  }
  else if(state.dest[0] > state.origin[0] && state.dest[1] >  state.origin[1]){
    for(var i= 1; i < state.dest[0] - state.origin[0]; i++){
      if(state.board[state.origin[0]+i][state.origin[1]+i]!='empty'){
        return false;
      }
    }
  }
  else if(state.dest[0]< state.origin[0] && state.dest[1] >  state.origin[1]){
    for(var i= 1; i < state.origin[0] - state.dest[0]; i++){
      if(state.board[state.origin[0]-i][state.origin[1]+i]!='empty'){
        return false;
      }
    }
  }
  else{
    for(var i= 1; i < state.dest[0] - state.origin[0]; i++){
      if(state.board[state.origin[0]+i][state.origin[1]-i]!='empty'){
        return false;
      }
    }
  }
  return true;
}

function validRookMove() {
  //Piece cannot have changed both row and column
  if (state.origin[0] !== state.dest[0] && state.origin[1] !== state.dest[1]) {
    return false
  //Cannot have jumped over any pieces
  } else if (state.origin[0] === state.dest[0]) {
    return noHorizontalJump();
  } else {
    return noVerticalJump();
  }
}

function validKnightMove() {
  var distOne = Math.abs(state.origin[0] - state.dest[0]);
  var distTwo = Math.abs(state.origin[1] - state.dest[1]);
  //minimum distance between starting and ending square == 1 and maximum == 2 (moved in 2x1 l shape)
  return Math.max(distOne,distTwo) === 2 && Math.min(distOne, distTwo) ===1 ;
}

function validBishopMove(){
  //Absolute difference between origin and destination columns and rows must be the same (diagonal move)
  if (Math.abs(state.origin[0] - state.dest[0]) === Math.abs(state.origin[1] - state.dest[1])){
    //piece cannot have 'jumped' over non-empty squares
    return noDiagonalJump();
  }
  else{
    return false;
  }
}

//King cannot have moved more than 1 square in other directions.
function validKingMove(){
  return (Math.abs(state.origin[0] - state.dest[0]) < 2) && (Math.abs(state.origin[1] - state.dest[1]) < 2) 
}

//Reusing bishop and rook functions.
function validQueenMove(){
  return validBishopMove() || validRookMove()
}

function validBlackPawnMove(){
  if(state.origin[0]-state.dest[0] === -1 && state.dest[1] === state.origin[1] && state.board[state.dest[0]][state.dest[1]]==='empty'){
    return true
  }
  if(state.origin[0]-state.dest[0] === -1 && Math.abs(state.dest[1]-state.origin[1]) ===1 && state.board[state.dest[0]][state.dest[1]][0]==='w'){
    return true;
  }
  if(state.origin[0]== 1 && state.dest[0] == 3 && state.dest[1] === state.origin[1] && state.board[state.dest[0]][state.dest[1]]==='empty'){
    return true;
  }
  return false
}

function validWhitePawnMove(){
  //moved 1 forward to empty square
  if(state.origin[0]-state.dest[0] === 1 && state.dest[1] === state.origin[1] && state.board[state.dest[0]][state.dest[1]]==='empty'){
    return true;
  }
  //moved 1 forward, 1 diagonal and captured piece
  if(state.origin[0]-state.dest[0] === 1 && Math.abs(state.dest[1]-state.origin[1]) ===1 && state.board[state.dest[0]][state.dest[1]][0]==='b'){
    return true;
  }

  //moved two forward from starting row
  if(state.origin[0]== 6 && state.dest[0] == 4 && state.dest[1] === state.origin[1] && state.board[state.dest[0]][state.dest[1]]==='empty'){
    return true;
  }
  return false
}
//all nojump functions check that the candidate move does not involve an illegal 'jump' 
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
//same as above for horizontal jumps
function noHorizontalJump(){
  if (state.origin[1] > state.dest[1]) {
    for(var i=state.dest[1]+1; i < state.origin[1]; i++){
      if(state.board[state.dest[0]][i]!='empty'){
        return false;
      }
    }
  }
  else{
    console.log('check horizontal left')
    for(var i=state.origin[1]+1; i < state.dest[1]; i++){
      if(state.board[state.dest[0]][i]!='empty'){
        return false;
      }
    }
  }
  return true;
}

function noDiagonalJump(){
  if(state.dest[0]< state.origin[0] && state.dest[1] <  state.origin[1]){
    for(var i= 1; i < state.origin[0] - state.dest[0]; i++){
      if(state.board[state.dest[0]+i][state.dest[1]+i]!='empty'){
        return false;
      }
    }
  }
  else if(state.dest[0]< state.origin[0] && state.dest[1] <  state.origin[1]){
    for(var i= 1; i < state.dest[0] - state.origin[0]; i++){
      if(state.board[state.origin[0]+i][state.origin[1]+i]!='empty'){
        return false;
      }
    }
  }
  else{
    return true;
  }
  return true;
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

function validRookMove() {
  if (state.origin[0] !== state.dest[0] && state.origin[1] !== state.dest[1]) {
    return false
  } else if (state.origin[0] === state.dest[0]) {
    return noHorizontalJump();
  } else {
    return noVerticalJump();
  }
}

function validKnightMove() {
  var distOne = Math.abs(state.origin[0] - state.dest[0]);
  var distTwo = Math.abs(state.origin[1] - state.dest[1]);
  return Math.max(distOne,distTwo) === 2 && Math.min(distOne, distTwo) ===1 ;
}

function validBishopMove(){
  if (Math.abs(state.origin[0] - state.dest[0]) === Math.abs(state.origin[1] - state.dest[1])){
    return noDiagonalJump();
  }
  else{
    return false;
  }
}


function validKingMove(){
  if (Math.abs(state.origin[0] - state.dest[0]) >1) {
    return false;
  } else if (Math.abs(state.origin[1] - state.dest[1]) >1) {
    return false;
  } else {
    return true
  }
}

function validQueenMove(){
  return true
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
  if(state.origin[0]-state.dest[0] === 1 && state.dest[1] === state.origin[1] && state.board[state.dest[0]][state.dest[1]]==='empty'){
    return true;
  }
  if(state.origin[0]-state.dest[0] === 1 && Math.abs(state.dest[1]-state.origin[1]) ===1 && state.board[state.dest[0]][state.dest[1]][0]==='b'){
    return true;
  }

  if(state.origin[0]== 6 && state.dest[0] == 4 && state.dest[1] === state.origin[1] && state.board[state.dest[0]][state.dest[1]]==='empty'){
    return true;
  }
  
  return false
}
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
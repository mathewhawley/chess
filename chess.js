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

const getCoords = (el) => {
  return $(el).attr('id').toString().split('-').map(i => parseInt(i, 10))
}

const state = {
  selected: [],
  turn: 'w'
}

$('#board').on('click', '.cell', event => {
  if (!state.selected.length) {
    const coords = getCoords(event.target)
    if (board[coords[0]][coords[1]][0]== state.turn) {
      $(event.target).addClass('cell--selected');
      state.selected = coords;
      state.turn = state.turn === 'b' ? 'w' : 'b'
    }
  } else {
    const coords2 = getCoords(event.target)
    const startCellContents = board[state.selected[0]][state.selected[1]]
    const endCellContents = board[coords2[0]][coords2[1]]
    board[state.selected[0]][state.selected[1]]=endCellContents;
    board[coords2[0]][coords2[1]]=startCellContents;
    $('#board').empty();
    state.selected = [];
    render(board)
  }
})


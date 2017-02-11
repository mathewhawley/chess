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
  return $(el).attr('id').toString().split('-')
}

const state = {
  selected: []
}

$('#board').on('click', '.cell', event => {
  if (!state.selected.length) {
    $(event.target).addClass('cell--selected')
    const coords = getCoords(event.target)
    state.selected = coords
  } else {
    const coords2 = getCoords(event.target)
    const startCellContents = board[parseInt(state.selected[0], 10)][parseInt(state.selected[1], 10)]
    const endCellContents = board[parseInt(coords2[0], 10)][parseInt(coords2[1], 10)]
    board[parseInt(state.selected[0], 10)][parseInt(state.selected[1], 10)]=endCellContents;
    board[parseInt(coords2[0], 10)][parseInt(coords2[1], 10)]=startCellContents;
    $('#board').empty();
    state.selected = [];
    render(board)
  }
})


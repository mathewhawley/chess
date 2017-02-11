const mountNode = $('#board')

const createBoard = (height, width) => {
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

const board = createBoard(8, 8)

const render = (board) => {
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      const color = (i + j) % 2 ? 'black' : 'white'
      const html = `<div class="cell cell--${color} cell--${i}-${j} cell--${cell}"></div>`
      $(html).appendTo('#board')
    })
  })
}

render(board)
const hasPebble = (board, [i, j]) => board[i] && board[i][j]

export const clonable = (board, [i, j]) =>
  hasPebble(board, [i, j]) &&
  !hasPebble(board, [i, j + 1]) &&
  !hasPebble(board, [i + 1, j])

export const boardPresenter = (board) =>
  board.map((row, i) => row.map((pebble, j) =>
    ({ pebble, clonable: clonable(board, [i, j]), location: [i, j] })
  ))

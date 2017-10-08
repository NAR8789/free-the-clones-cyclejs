import { clonable } from './presenter'

const ensureSpace = (board, [i, j]) => {
  if (board.length <= i) {
    return ensureSpace([...board, []], [i, j])
  } else if (board[i].length <= j) {
    return ensureSpace([
      ...board.slice(0, i),
      [...board[i], false],
      ...board.slice(i + 1),
    ], [i, j])
  } else {
    return board
  }
}

const ensureSpaces = (board, ...locations) =>
  locations.reduce(ensureSpace, board)

export const propagate = (board, [i, j]) => {
  if (!clonable(board, [i, j])) { return board }

  return ensureSpaces(board,
    [i + 1, j],
    [i, j + 1],
    [i + 1, j + 1]
  ).map((row, x) => row.map((pebble, y) => {
    if (x === i && y === j) {
      return false
    } else if (x === i && y === j + 1) {
      return true
    } else if (x === i + 1 && y === j) {
      return true
    } else {
      return pebble
    }
  }))
}

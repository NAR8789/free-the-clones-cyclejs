import {clonable} from './model'

export const boardPresenter = (board) =>
  board.map((row, i) => row.map((pebble, j) =>
    ({ pebble, clonable: clonable(board, [i, j]), location: [i, j] })
  ))

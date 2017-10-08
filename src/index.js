import xs from 'xstream'
import {run} from '@cycle/run'
import {div, span, makeDOMDriver} from '@cycle/dom'

const hasPebble = (board, i, j) => board[i] && board[i][j]
const clonable = (board, i, j) =>
  hasPebble(board, i, j) &&
  !hasPebble(board, i, j + 1) &&
  !hasPebble(board, i + 1, j)

const augmentedBoard = (board) =>
  board.map((row, i) => row.map((pebble, j) =>
    ({ pebble, clonable: clonable(board, i, j), location: [i, j] })
  ))

const displayBoard = (board) =>
  div('.board', augmentedBoard(board).map(row =>
    div('.row', row.map(({ pebble, clonable, location }) =>
      span('.square.fa-circle', { class: { pebble, clonable } })
    ))
  ))

const main = (sources) => {
  const board$ = xs.from(
    [[
      [true, true],
      [true, false]
    ]])

  const vdom$ = board$.map(displayBoard)
  return {
    DOM: vdom$
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

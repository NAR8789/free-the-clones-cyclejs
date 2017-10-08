import {run} from '@cycle/run'
import {div, span, makeDOMDriver} from '@cycle/dom'
import { compose } from 'pointfree-fantasy'

// intent
const propagation = (propagationClick) =>
  [parseInt(propagationClick.target.dataset.i), parseInt(propagationClick.target.dataset.j)]

// model
const ensureSpace = (board, [i, j]) => {
  if (i >= board.length) {
    return ensureSpace([...board, []], [i, j])
  } else if (j >= board[i].length) {
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

const propagate = (board, [i, j]) => {
  if (!clonable(board, i, j)) { return board }

  return ensureSpaces(board, [i + 1, j], [i, j + 1], [i + 1, j + 1])
    .map((row, x) => row.map((pebble, y) => {
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

// viewModel
const hasPebble = (board, i, j) => board[i] && board[i][j]

const clonable = (board, i, j) =>
  hasPebble(board, i, j) &&
  !hasPebble(board, i, j + 1) &&
  !hasPebble(board, i + 1, j)

const augmentedBoard = (board) =>
  board.map((row, i) => row.map((pebble, j) =>
    ({ pebble, clonable: clonable(board, i, j), location: [i, j] })
  ))

// view
const displayBoard = (augmentedBoard) =>
  div('.board', augmentedBoard.map(row =>
    div('.row', row.map(({ pebble, clonable, location: [i, j] }) =>
      span('.square.fa-circle', {
        class: { pebble, clonable },
        attrs: { 'data-i': i, 'data-j': j, 'data-location': [i, j] }
      })
    ))
  ))

const main = (sources) => {
  const propagationClicks$ = sources.DOM.select('.pebble.clonable').events('click')
  const propagations$ = propagationClicks$.map(propagation)
  const board$ = propagations$
    .fold(propagate, [
      [true, true],
      [true, false]
    ])

  const vdom$ = board$.map(compose(displayBoard, augmentedBoard))
  return {
    DOM: vdom$
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

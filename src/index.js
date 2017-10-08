import {run} from '@cycle/run'
import {div, span, makeDOMDriver} from '@cycle/dom'

// intent
const propagation = (propagationClick) =>
  [parseInt(propagationClick.target.dataset.i), parseInt(propagationClick.target.dataset.j)]

// model
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

const propagate = (board, [i, j]) => {
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

// presenter
const hasPebble = (board, [i, j]) => board[i] && board[i][j]

const clonable = (board, [i, j]) =>
  hasPebble(board, [i, j]) &&
  !hasPebble(board, [i, j + 1]) &&
  !hasPebble(board, [i + 1, j])

const boardPresenter = (board) =>
  board.map((row, i) => row.map((pebble, j) =>
    ({ pebble, clonable: clonable(board, [i, j]), location: [i, j] })
  ))

// view
const boardDOM = (boardPresenter) =>
  div('.board', boardPresenter.map(row =>
    div('.row', row.map(({ pebble, clonable, location: [i, j] }) =>
      span('.square.fa-circle', {
        class: { pebble, clonable },
        attrs: { 'data-i': i, 'data-j': j }
      })
    ))
  ))

const main = (sources) => {
  const propagationClick$ = sources.DOM.select('.pebble.clonable').events('click')
  const propagation$ = propagationClick$.map(propagation)
  const board$ = propagation$
    .fold(propagate,
      [ [true, true],
        [true, false] ]
    )
  const boardPresenter$ = board$.map(boardPresenter)
  const boardDOM$ = boardPresenter$.map(boardDOM)
  return {
    DOM: boardDOM$
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

import xs from 'xstream'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { board as boardController } from 'board'
import { moveHistory as moveHistoryController } from 'move-history'

import { combinedDOM } from 'view'

const main = (sources) => {
  const board = boardController(sources)
  const moveHistory = moveHistoryController(board.propagation$)

  const combinedDOM$ = xs.combine(board.DOM, moveHistory.DOM)
    .map(combinedDOM).remember()

  return {
    DOM: combinedDOM$
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

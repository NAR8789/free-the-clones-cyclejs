import xs from 'xstream'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { board as boardController } from 'board'
import { moveHistory as moveHistoryController } from 'move-history'

import { combinedDOM } from 'view'

const main = (sources) => {
  const board = boardController(sources)

  const moveHistory1 = moveHistoryController.main1(board)
  const moveHistory$ = moveHistory1.reducer$.fold((moveHistory, reducer) => reducer(moveHistory), [])
  const moveHistory2 = moveHistoryController.main2({ moveHistory$ })

  const combinedDOM$ = xs.combine(board.DOM, moveHistory2.DOM)
    .map(combinedDOM).remember()

  return {
    DOM: combinedDOM$
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

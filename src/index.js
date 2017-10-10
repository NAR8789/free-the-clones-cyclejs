import xs from 'xstream'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { board as boardController } from 'board'
import { moveHistory as moveHistoryController } from 'move-history'

import { combinedDOM } from 'view'

const main = (sources) => {
  const board1 = boardController.main1(sources)
  const board$ = board1.reducer$
    .fold((board, reducer) => reducer(board),
      [ [true, true],
        [true, false] ]
    )
  const board2 = boardController.main2({ board$ })

  const moveHistory1 = moveHistoryController.main1(board1)
  const moveHistory$ = moveHistory1.reducer$.fold((moveHistory, reducer) => reducer(moveHistory), [])
  const moveHistory2 = moveHistoryController.main2({ moveHistory$ })

  const combinedDOM$ = xs.combine(board2.DOM, moveHistory2.DOM)
    .map(combinedDOM).remember()

  return {
    DOM: combinedDOM$
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

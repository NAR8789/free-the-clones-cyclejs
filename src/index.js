import xs from 'xstream'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { propagationClick$ as getPropagationClick$ } from 'board/event'
import { propagation } from 'board/intent'
import { propagate } from 'board/mutation'
import { boardPresenter } from 'board/presenter'
import { boardDOM } from 'board/view'

import { recordMove } from 'move-history/mutation'
import { moveHistoryDOM } from 'move-history/view'

import { combinedDOM } from 'view'

const main = (sources) => {
  const propagationClick$ = getPropagationClick$(sources.DOM)
  const propagation$ = propagationClick$.map(propagation)
  const board$ = propagation$
    .fold(propagate,
      [ [true, true],
        [true, false] ]
    )
  const boardPresenter$ = board$.map(boardPresenter)
  const boardDOM$ = boardPresenter$.map(boardDOM)

  const moveHistory$ = propagation$
    .fold(recordMove, [])
  const moveHistoryDOM$ = moveHistory$.map(moveHistoryDOM)

  const combinedDOM$ = xs.combine(boardDOM$, moveHistoryDOM$)
    .map(combinedDOM).remember()

  return {
    DOM: combinedDOM$
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

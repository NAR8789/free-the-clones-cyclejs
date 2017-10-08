import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { propagation } from 'board/intent'
import { propagate } from 'board/model'
import { boardPresenter } from 'board/presenter'
import { boardDOM, getPropagationClick$ } from 'board/view'

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

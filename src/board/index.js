import { propagationClick$ as getPropagationClick$ } from 'board/event'
import { propagation } from 'board/intent'
import { propagate } from 'board/mutation'
import { boardPresenter } from 'board/presenter'
import { boardDOM } from 'board/view'

export const board = (sources) => {
  const propagationClick$ = getPropagationClick$(sources.DOM)
  const propagation$ = propagationClick$.map(propagation)
  const board$ = propagation$
    .fold(propagate,
      [ [true, true],
        [true, false] ]
    )
  const boardPresenter$ = board$.map(boardPresenter)
  const boardDOM$ = boardPresenter$.map(boardDOM)

  return {
    propagation$,
    DOM: boardDOM$
  }
}
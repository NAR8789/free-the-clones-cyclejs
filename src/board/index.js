import { propagationClick$ as getPropagationClick$ } from 'board/event'
import { propagation } from 'board/intent'
import { propagate } from 'board/mutation'
import { boardPresenter } from 'board/presenter'
import { boardDOM } from 'board/view'

export const board = {
  main1: (sources) => {
    const propagationClick$ = getPropagationClick$(sources.DOM)
    const propagation$ = propagationClick$.map(propagation)
    const reducer$ = propagation$.map(propagate)
    const initialState =
      [ [true, true],
        [true, false] ]

    return {
      propagation$,
      reducer$,
      initialState,
    }
  },
  main2: (states) => {
    const boardPresenter$ = states.state$.map(boardPresenter)
    const boardDOM$ = boardPresenter$.map(boardDOM)

    return {
      DOM: boardDOM$
    }
  }
}

import { propagationClick$ as getPropagationClick$ } from 'board/event'
import { propagation } from 'board/intent'
import { curriedPropagate } from 'board/mutation'
import { boardPresenter } from 'board/presenter'
import { boardDOM } from 'board/view'

export const board = {
  main1: (sources) => {
    const propagationClick$ = getPropagationClick$(sources.DOM)
    const propagation$ = propagationClick$.map(propagation)
    const reducer$ = propagation$.map(curriedPropagate)

    return {
      propagation$,
      reducer$
    }
  },
  main2: (states) => {
    const boardPresenter$ = states.board$.map(boardPresenter)
    const boardDOM$ = boardPresenter$.map(boardDOM)

    return {
      DOM: boardDOM$
    }
  }
}

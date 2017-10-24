import { propagationClick$ as getPropagationClick$ } from 'board/event'
import { propagation } from 'board/intent'
import { propagate } from 'board/mutation'
import { boardPresenter } from 'board/presenter'
import { boardDOM } from 'board/view'

export const board = {
  initialState:
    [ [true, true],
      [true, false] ],
  sourcesToIntents: (sources) => {
    const propagationClick$ = getPropagationClick$(sources.DOM)
    const propagationIntent$ = propagationClick$.map(propagation)

    return {
      propagationIntent$,
    }
  },
  intentsToReducers: {
    propagationIntent$: [propagate],
  },
  statesToViews: (state) => {
    const boardPresenter$ = state.state$.map(boardPresenter)
    const boardDOM$ = boardPresenter$.map(boardDOM)

    return { DOM: boardDOM$ }
  }
}

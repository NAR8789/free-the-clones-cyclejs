import { propagationClick$ as getPropagationClick$ } from 'board/event'
import { propagation } from 'board/intent'
import { propagate } from 'board/mutation'
import { boardPresenter } from 'board/presenter'
import { boardDOM } from 'board/view'

export const board = {
  initialState:
    [ [true, true],
      [true, false] ],
  stateProgression: (sources) => {
    const propagationClick$ = getPropagationClick$(sources.DOM)
    const propagationIntent$ = propagationClick$.map(propagation)
    const reducer$ = propagationIntent$.map(propagate)

    return {
      propagationIntent$, // not usually returned with stateProgression, but move-history is interested in this stream
      reducer$,
    }
  },
  viewProgression: (state) => {
    state.state$.subscribe({next: console.log})
    const boardPresenter$ = state.state$.map(boardPresenter)
    const boardDOM$ = boardPresenter$.map(boardDOM)

    return { DOM: boardDOM$ }
  }
}

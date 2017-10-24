import { tagged } from 'intent-helpers'
import { propagationClick$ as getPropagationClick$ } from 'board/event'
import { propagation } from 'board/intent'
import { propagate } from 'board/mutation'
import { boardPresenter } from 'board/presenter'
import { boardDOM } from 'board/view'

const o = true
const _ = false
// board layout "DSL"

export const board = {
  initialState:
    [ [o, o],
      [o, _] ],
  sourcesToIntents: (sources) => {
    const propagationClick$ = getPropagationClick$(sources.DOM)
    const propagationIntent$ = propagationClick$.map(propagation)

    return tagged('propagation', propagationIntent$)
  },
  reducersForTag: {
    propagation: [propagate],
  },
  statesToViews: (state) => {
    const boardPresenter$ = state.state$.map(boardPresenter)
    const boardDOM$ = boardPresenter$.map(boardDOM)

    return { DOM: boardDOM$ }
  }
}

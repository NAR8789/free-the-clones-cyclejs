import { recordMove } from 'move-history/mutation'
import { moveHistoryDOM } from 'move-history/view'

export const moveHistory = {
  stateProgression: (sources) => ({
    reducer$: sources.propagation$.map(recordMove),
    initialState: [],
  }),
  viewProgression: (states) => {
    const moveHistoryDOM$ = states.state$.map(moveHistoryDOM)

    return {
      DOM: moveHistoryDOM$,
    }
  },
}

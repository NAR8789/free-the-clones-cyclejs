import { recordMove } from 'move-history/mutation'
import { moveHistoryDOM } from 'move-history/view'

export const moveHistory = {
  main1: (sources) => ({
    reducer$: sources.propagation$.map(recordMove),
    initialState: [],
  }),
  main2: (states) => {
    const moveHistoryDOM$ = states.state$.map(moveHistoryDOM)

    return {
      DOM: moveHistoryDOM$,
    }
  },
}

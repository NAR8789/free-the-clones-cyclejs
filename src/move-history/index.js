import { curriedRecordMove } from 'move-history/mutation'
import { moveHistoryDOM } from 'move-history/view'

export const moveHistory = {
  main1: (sources) => ({
    reducer$: sources.propagation$.map(curriedRecordMove),
    initialState: [],
  }),
  main2: (states) => {
    const moveHistoryDOM$ = states.moveHistory$.map(moveHistoryDOM)

    return {
      DOM: moveHistoryDOM$,
    }
  },
}

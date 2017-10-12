import { recordMove } from 'move-history/mutation'
import { moveHistoryDOM } from 'move-history/view'

export const moveHistory = {
  initialState: [],
  stateProgression: (sources) => ({ reducer$: sources.propagationIntent$.map(recordMove) }),
  viewProgression: (state) => ({ DOM: state.state$.map(moveHistoryDOM) }),
}

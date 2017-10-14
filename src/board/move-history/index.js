import { recordMove } from './mutation'
import { moveHistoryDOM } from './view'

export const moveHistory = {
  initialState: [],
  stateProgression: (sources) => ({ reducer$: sources.propagationIntent$.map(recordMove) }),
  viewProgression: (state) => ({ DOM: state.state$.map(moveHistoryDOM) }),
}

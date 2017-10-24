import { recordMove } from './mutation'
import { moveHistoryDOM } from './view'

export const moveHistory = {
  initialState: [],
  sourcesToIntents: (_sources) => ({}),
  intentsToReducers: { propagationIntent$: [recordMove] },
  statesToViews: (state) => ({ DOM: state.state$.map(moveHistoryDOM) }),
}

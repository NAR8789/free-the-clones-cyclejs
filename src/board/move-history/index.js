import { Observable } from 'rxjs/Rx'
import { recordMove } from './mutation'
import { moveHistoryDOM } from './view'

export const moveHistory = {
  initialState: [],
  sourcesToIntents: (_) => Observable.empty(),
  reducersForTag: { propagation: [recordMove] },
  statesToViews: (state) => ({ DOM: state.state$.map(moveHistoryDOM) }),
}

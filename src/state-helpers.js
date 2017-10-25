import { Observable } from 'rxjs/Rx'
import { pipe, map } from 'ramda'

const localizeReducer = namespace => reducer => intent => state => ({ ...state, [namespace]: reducer(intent)(state[namespace]) })
const delocalizeStates = (namespace) => ({ state$, ...opts }) => ({
  state$: state$.map(({ [namespace]: subState }) => subState),
  ...opts
})

export const localizeState = (namespace) => ({ initialState, reducersForTag, statesToViews, ...rest }) => {
  return {
    initialState: typeof initialState === 'undefined' ? {} : { [namespace]: initialState },
    reducersForTag: map(map(localizeReducer(namespace)), reducersForTag),
    statesToViews: (states) => statesToViews(delocalizeStates(namespace)(states)),
    ...rest
  }
}

export const cyclifyComponent = ({ initialState, sourcesToIntents, reducersForTag, statesToViews }) =>
  (sources) => {
    const intent$ = sourcesToIntents(sources)
    const reducer$ = intent$
      .map(({ tag, intent }) => [reducersForTag[tag], intent])
      .filter(([reducers, intent]) => typeof reducers !== 'undefined')
      .map(([reducers, intent]) =>
        pipe(...reducers.map(reducer => reducer(intent)))
      )

    const state$ = reducer$
      .startWith(initialState)
      .scan((board, reducer) => reducer(board))
    return { ...statesToViews({ state$ }), intent$, state$ }
    // returning the intent$ and state$ breaks abstraction, but is useful for hooking and debugging
  }

export const bicyclifyComponent = (cycleMain) => {
  let view$s
  return {
    sourcesToIntents: (sources) => {
      const { intent$, ...sinks } = cycleMain(sources)
      view$s = sinks
      return intent$ || Observable.empty()
    },
    reducersForTag: {},
    statesToViews: (states) => view$s
  }
}

export const privatizeState = (component) => bicyclifyComponent(cyclifyComponent(component))

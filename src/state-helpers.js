import { Observable } from 'rxjs/Rx'
import { compose, map } from 'ramda'

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
    const reducer$ = intent$.map(({ tag, intent }) =>
      compose(...reducersForTag[tag].map(reducer => reducer(intent)))
    )

    const state$ = reducer$
      .startWith(initialState)
      .scan((board, reducer) => reducer(board))
    return { ...statesToViews({ state$ }), intent$ }
    // returning the intent$ is not strictly necessary, but it's useful for allowing other components to hook
  }

export const bicyclifyComponent = (cycleMain) => {
  let view$s
  return {
    initialState: {},
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

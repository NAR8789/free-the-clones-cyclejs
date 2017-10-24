import { Observable } from 'rxjs/Rx'
import { compose, keys, intersection, map } from 'ramda'

const localizeReducer = namespace => reducer => intent => state => ({ ...state, [namespace]: reducer(intent)(state[namespace]) })
const delocalizeStates = (namespace) => ({ state$, ...opts }) => ({
  state$: state$.map(({ [namespace]: subState }) => subState),
  ...opts
})

export const localizeState = (namespace) => ({ initialState, intentsToReducers, statesToViews, ...opts }) => {
  return {
    initialState: typeof initialState === 'undefined' ? {} : { [namespace]: initialState },
    intentsToReducers: map(map(localizeReducer(namespace)), intentsToReducers),
    statesToViews: (states) => statesToViews(delocalizeStates(namespace)(states)),
    ...opts
  }
}

export const cyclifyComponent = ({ initialState, sourcesToIntents, reducersForTag, statesToViews }) =>
  (sources) => {
    const taggedIntent$ = sourcesToIntents(sources)
    const taggedReducer$ = taggedIntent$.map(({ tag, intent }) =>
      ({
        tag,
        reducer: compose(
          ...reducersForTag[tag].map(reducer => reducer(intent)) // remember that each reducer additionally takes a state and returns a state
        ) // atomic state reducer of the composition of all state reducers for the given intent
      })
    )
    const reducer$ = taggedReducer$.map(({reducer}) => reducer)

    const state$ = reducer$
      .startWith(initialState)
      .scan((board, reducer) => reducer(board))
    return { ...statesToViews({ state$ }) }
  }

export const bicyclifyComponent = (cycleMain) => {
  let viewProgressionResult
  return {
    stateProgression: (sources) => {
      const { preState, ...sinks } = cycleMain(sources)
      viewProgressionResult = sinks
      return {
        ...preState,
        reducer$: Observable.empty()
      }
    },
    viewProgression: (states) => viewProgressionResult
  }
}

export const privatizeState = (component) => bicyclifyComponent(cyclifyComponent(component))

import { Observable } from 'rxjs/Rx'
import { compose, keys, intersection, map } from 'ramda'

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
    const taggedIntent$ = sourcesToIntents(sources)
    taggedIntent$.subscribe(console.log)
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

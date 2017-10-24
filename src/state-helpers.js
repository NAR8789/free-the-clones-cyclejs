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
    const taggedIntent$ = sourcesToIntents(sources)
    const reducer$ = taggedIntent$.map(({ tag, intent }) =>
      compose(...reducersForTag[tag].map(reducer => reducer(intent)))
    )

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

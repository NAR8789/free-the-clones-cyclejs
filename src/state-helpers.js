const localizeReducer$ = namespace => reducer$ => reducer$.map(localizeReducer(namespace))
const localizeReducer = namespace => reducer => state => ({ ...state, [namespace]: reducer(state[namespace]) })
const localizeStateProgression = (namespace) => ({reducer$, ...opts}) => ({
  reducer$: localizeReducer$(namespace)(reducer$),
  ...opts
})
const delocalizeStates = (namespace) => ({ state$, ...opts }) => ({
  state$: state$.map(({ [namespace]: subState }) => subState),
  ...opts
})

export const localizeComponent = (namespace) => ({ initialState, stateProgression, viewProgression }) => {
  return {
    initialState: { [namespace]: initialState },
    stateProgression: (sources) => localizeStateProgression(namespace)(stateProgression(sources)),
    viewProgression: (states) => viewProgression(delocalizeStates(namespace)(states)),
  }
}

export const cyclifyComponent = ({ initialState, stateProgression, viewProgression }) =>
  (sources) => {
    const { reducer$ } = stateProgression(sources)
    const state$ = reducer$
      .startWith(initialState)
      .scan((board, reducer) => reducer(board))
    return viewProgression({ state$ })
  }

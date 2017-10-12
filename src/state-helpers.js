const localizeReducer$ = namespace => reducer$ => reducer$.map(localizeReducer(namespace))
const localizeReducer = namespace => reducer => state => ({ ...state, [namespace]: reducer(state[namespace]) })
const localizeStateProgression = (namespace) => ({reducer$, initialState, ...opts}) => ({
  reducer$: localizeReducer$(namespace)(reducer$),
  ...opts
})
const delocalizeStates = (namespace) => ({ state$, ...opts }) => ({
  state$: state$.map(({ [namespace]: subState }) => subState),
  ...opts
})

export const localizeComponent = ({ initialState, stateProgression, viewProgression }, namespace) => {
  return {
    initialState: { [namespace]: initialState },
    stateProgression: (sources) => localizeStateProgression(namespace)(stateProgression(sources)),
    viewProgression: (states) => viewProgression(delocalizeStates(namespace)(states)),
  }
}

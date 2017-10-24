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

export const cyclifyComponent = ({ initialState, sourcesToIntents, intentsToReducers, statesToViews }) =>
  (sources) => {
    const intent$s = sourcesToIntents(sources)
    const reducer$s = intersection(keys(intent$s), keys(intentsToReducers))
      .map((intent$Name) => [intent$s[intent$Name], intentsToReducers[intent$Name]])
      .map(([intent$, reducers]) => intent$.map((intent) =>
        compose(
          ...reducers.map(reducer => reducer(intent)) // remember that each reducer additionally takes a state and returns a state
        ) // atomic state reducer of the composition of all state reducers for the given intent
      ))
    const reducer$ = Observable.merge(...reducer$s)
    reducer$.subscribe(console.log)

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

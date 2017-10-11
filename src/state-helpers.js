import { merge } from 'lodash'
import xs from 'xstream'

const localizeReducer$ = (reducer$, namespace) => reducer$.map(localizeReducer(namespace))
const localizeReducer = namespace => reducer => state => Object.assign(state, { [namespace]: reducer(state[namespace]) })
export const localizeStateProgression = ({reducer$, initialState}, namespace) => ({
  reducer$: localizeReducer$(reducer$, namespace),
  initialState: { [namespace]: initialState },
})
export const mergeStateProgressions = (...stateProgressions) => ({
  reducer$: xs.merge(...stateProgressions.map(({reducer$}) => reducer$)),
  initialState: merge({}, ...stateProgressions.map(({initialState}) => initialState))
})
export const delocalizeStates = (namespace, { state$ }) => ({ state$: state$.map(({ [namespace]: subState }) => subState) })

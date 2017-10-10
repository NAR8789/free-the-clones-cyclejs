import { merge } from 'lodash'
import xs from 'xstream'

const localizeReducer$ = (reducer$, namespace) => reducer$.map(localizeReducer(namespace))
const localizeReducer = namespace => reducer => state => Object.assign(state, { [namespace]: reducer(state[namespace]) })
export const localizeMutationBundle = ({reducer$, initialState}, namespace) => ({
  reducer$: localizeReducer$(reducer$, namespace),
  initialState: { [namespace]: initialState },
})
export const mergeMutationBundles = (...mutationBundles) => ({
  reducer$: xs.merge(...mutationBundles.map(({reducer$}) => reducer$)),
  initialState: merge({}, ...mutationBundles.map(({initialState}) => initialState))
})
export const delocalizeStates = (namespace, { state$ }) => ({ state$: state$.map(({ [namespace]: subState }) => subState) })

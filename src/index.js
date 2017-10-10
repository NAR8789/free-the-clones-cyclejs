import { merge } from 'lodash'
import xs from 'xstream'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { board as boardController } from 'board'
import { moveHistory as moveHistoryController } from 'move-history'

import { combinedDOM } from 'view'

const localizeReducer$ = (reducer$, namespace) => reducer$.map(localizeReducer(namespace))
const localizeReducer = namespace => reducer => state => Object.assign(state, { [namespace]: reducer(state[namespace]) })
const localizeMutationBundle = ({reducer$, initialState}, namespace) => ({
  reducer$: localizeReducer$(reducer$, namespace),
  initialState: { [namespace]: initialState },
})
const mergeMutationBundles = (...mutationBundles) => ({
  reducer$: xs.merge(...mutationBundles.map(({reducer$}) => reducer$)),
  initialState: merge({}, ...mutationBundles.map(({initialState}) => initialState))
})
const delocalizeStates = (namespace, { state$ }) => ({ state$: state$.map(({ [namespace]: subState }) => subState) })

const main1 = (sources) => {
  const board1 = boardController.main1(sources)
  const moveHistory1 = moveHistoryController.main1(board1)

  return mergeMutationBundles(
    localizeMutationBundle(board1, 'board'),
    localizeMutationBundle(moveHistory1, 'moveHistory')
  )
}

const main2 = (state) => {
  const board2 = boardController.main2(delocalizeStates('board', state))
  const moveHistory2 = moveHistoryController.main2(delocalizeStates('moveHistory', state))

  const combinedDOM$ = xs.combine(board2.DOM, moveHistory2.DOM)
    .map(combinedDOM).remember()

  return {
    DOM: combinedDOM$
  }
}

const main = (sources) => {
  const { reducer$, initialState } = main1(sources)
  const state$ = reducer$.fold((board, reducer) => reducer(board), initialState)
  return main2({ state$ })
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

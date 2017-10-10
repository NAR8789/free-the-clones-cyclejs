import xs from 'xstream'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { mergeMutationBundles, localizeMutationBundle, delocalizeStates } from 'state-helpers'

import { board as boardController } from 'board'
import { moveHistory as moveHistoryController } from 'move-history'

import { combinedDOM } from 'view'

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

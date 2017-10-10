import xs from 'xstream'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { board as boardController } from 'board'
import { moveHistory as moveHistoryController } from 'move-history'

import { combinedDOM } from 'view'

const localizeReducer = namespace => reducer => state => Object.assign(state, { [namespace]: reducer(state[namespace]) })
const delocalizeState = (namespace, state$) => state$.map(({ [namespace]: subState }) => subState)

const main = (sources) => {
  const board1 = boardController.main1(sources)
  const moveHistory1 = moveHistoryController.main1(board1)

  const reducer$ = xs.merge(
    board1.reducer$.map(localizeReducer('board')),
    moveHistory1.reducer$.map(localizeReducer('moveHistory'))
  )
  const state$ = reducer$.fold((board, reducer) => reducer(board), {
    board: board1.initialState,
    moveHistory: moveHistory1.initialState
  })

  const board$ = delocalizeState('board', state$)
  const moveHistory$ = delocalizeState('moveHistory', state$)

  const board2 = boardController.main2({ board$ })
  const moveHistory2 = moveHistoryController.main2({ moveHistory$ })

  const combinedDOM$ = xs.combine(board2.DOM, moveHistory2.DOM)
    .map(combinedDOM).remember()

  return {
    DOM: combinedDOM$
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

import xs from 'xstream'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { mergeMutationBundles, localizeMutationBundle, delocalizeStates } from 'state-helpers'

import { board } from 'board'
import { moveHistory } from 'move-history'

import { combinedDOM } from 'view'

const freeTheClones = {
  stateProgression: (sources) => {
    const boardStateProgression = board.stateProgression(sources)
    const moveHistoryStateProgression = moveHistory.stateProgression(boardStateProgression)

    return mergeMutationBundles(
      localizeMutationBundle(boardStateProgression, 'board'),
      localizeMutationBundle(moveHistoryStateProgression, 'moveHistory')
    )
  },
  viewProgression: (state) => {
    const boardViewProgression = board.viewProgression(delocalizeStates('board', state))
    const moveHistoryViewProgression = moveHistory.viewProgression(delocalizeStates('moveHistory', state))

    const combinedDOM$ = xs.combine(boardViewProgression.DOM, moveHistoryViewProgression.DOM)
      .map(combinedDOM).remember()

    return {
      DOM: combinedDOM$
    }
  }
}

const main = (sources) => {
  const { reducer$, initialState } = freeTheClones.stateProgression(sources)
  const state$ = reducer$.fold((board, reducer) => reducer(board), initialState)
  return freeTheClones.viewProgression({ state$ })
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

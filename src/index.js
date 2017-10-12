import xs from 'xstream'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { localizeComponent } from 'state-helpers'

import { board as boardUnlocalized } from 'board'
import { moveHistory as moveHistoryUnlocalized } from 'move-history'

import { combinedDOM } from 'view'

const board = localizeComponent('board')(boardUnlocalized)
const moveHistory = localizeComponent('moveHistory')(moveHistoryUnlocalized)

const freeTheClones = {
  initialState: {
    ...board.initialState,
    ...moveHistory.initialState,
  },
  stateProgression: (sources) => {
    const { propagationIntent$, reducer$: boardReducer$ } = board.stateProgression(sources)
    const { reducer$: moveHistoryReducer$ } = moveHistory.stateProgression({ propagationIntent$ })

    return { reducer$: xs.merge(boardReducer$, moveHistoryReducer$) }
  },
  viewProgression: (state) => {
    const boardDOM$ = board.viewProgression(state).DOM
    const moveHistoryDOM$ = moveHistory.viewProgression(state).DOM

    const combinedDOM$ =
      xs.combine(boardDOM$, moveHistoryDOM$)
        .map(([boardDOM, moveHistoryDOM]) => combinedDOM({boardDOM, moveHistoryDOM}))
        .remember()

    return { DOM: combinedDOM$ }
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(cyclifyComponent(freeTheClones), drivers)

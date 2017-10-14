import Rx from 'rxjs/Rx'
import { run } from '@cycle/rxjs-run'
import { makeDOMDriver } from '@cycle/dom'
import { localizeComponent, cyclifyComponent } from 'state-helpers'
import { board as boardUnlocalized } from 'board'
import { moveHistory as moveHistoryUnlocalized } from 'board/move-history'
import { combinedDOM } from 'view'
import { undoTree } from 'undo-tree'

const { Observable } = Rx
const board = localizeComponent('board')(boardUnlocalized)
const moveHistory = localizeComponent('moveHistory')(moveHistoryUnlocalized)

const freeTheClones = {
  initialState: {
    ...board.initialState,
    ...moveHistory.initialState,
  },
  stateProgression: (sources) => {
    const { reducer$: boardReducer$, propagationIntent$ } = board.stateProgression(sources)
    const { reducer$: moveHistoryReducer$ } = moveHistory.stateProgression({ propagationIntent$ })

    return { reducer$: Observable.merge(boardReducer$, moveHistoryReducer$) }
  },
  viewProgression: (state) => {
    const boardDOM$ = board.viewProgression(state).DOM
    const moveHistoryDOM$ = moveHistory.viewProgression(state).DOM

    const combinedDOM$ =
      Observable.zip(
        boardDOM$,
        moveHistoryDOM$,
        (boardDOM, moveHistoryDOM) => combinedDOM({boardDOM, moveHistoryDOM})
      )

    return { DOM: combinedDOM$ }
  }
}

const undoableFreeTheClones = undoTree('#undo', '#redo')(freeTheClones)

run(cyclifyComponent(board), { DOM: makeDOMDriver('#free-the-clones') })

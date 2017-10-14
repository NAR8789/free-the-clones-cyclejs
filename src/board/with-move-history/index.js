import { Observable } from 'rxjs/Rx'
import { localizeComponent } from 'state-helpers'
import { moveHistory as moveHistoryUnlocalized } from 'board/move-history'
import { combinedDOM } from './view'

export const withMoveHistory = (boardUnlocalized) => {
  const board = localizeComponent('board')(boardUnlocalized)
  const moveHistory = localizeComponent('moveHistory')(moveHistoryUnlocalized)

  return {
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
}

import { Observable } from 'rxjs/Rx'
import { localizeComponent } from 'state-helpers'
import { moveHistory as moveHistoryUnlocalized } from 'board/move-history'
import { combineIndependent } from 'combine-independent'

export const withMoveHistory = (boardUnlocalized) => {
  const board = localizeComponent('board')(boardUnlocalized)
  const moveHistory = localizeComponent('moveHistory')(moveHistoryUnlocalized)

  return {
    ...combineIndependent(board, moveHistory),
    stateProgression: (sources) => {
      const { reducer$: boardReducer$, propagationIntent$ } = board.stateProgression(sources)
      const { reducer$: moveHistoryReducer$ } = moveHistory.stateProgression({ propagationIntent$ })

      return { reducer$: Observable.merge(boardReducer$, moveHistoryReducer$) }
    },
  }
}

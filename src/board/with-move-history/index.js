import { localizeState } from 'state-helpers'
import { moveHistory } from 'board/move-history'
import { combineIndependent } from 'component-helpers'

export const withMoveHistory = (board) =>
  combineIndependent(
    localizeState('board')(board),
    localizeState('moveHistory')(moveHistory)
  )

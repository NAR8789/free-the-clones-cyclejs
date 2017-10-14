import { ol, li } from '@cycle/dom'

export const moveHistoryDOM = (moveHistory) =>
  [ ol('#move-history.moves', moveHistory.map(move =>
    li('.move', JSON.stringify(move))
  )) ]

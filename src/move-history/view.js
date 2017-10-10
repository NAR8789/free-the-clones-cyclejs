import { ol, li } from '@cycle/dom'

export const moveHistoryDOM = (moveHistory) =>
  ol('.moves', moveHistory.map(move =>
    li('.move', JSON.stringify(move))
  ))

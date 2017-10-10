import { div } from '@cycle/dom'

export const moveHistoryDOM = (moveHistory) =>
  div('.moves', moveHistory.map(move =>
    div('move', JSON.stringify(move))
  ))

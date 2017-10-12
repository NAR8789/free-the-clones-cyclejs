import { div } from '@cycle/dom'

export const combinedDOM = ({ moveHistoryDOM, boardDOM }) =>
  div('.container', [
    div('#move-history', moveHistoryDOM),
    div('#board', boardDOM)
  ])

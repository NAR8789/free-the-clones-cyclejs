import { div } from '@cycle/dom'

export const combinedDOM = ({ moveHistoryDOM, boardDOM }) =>
  [ div('#move-history', moveHistoryDOM),
    div('#board', boardDOM) ]

import { div } from '@cycle/dom'

export const combinedDOM = ({ moveHistoryDOM, boardDOM }) =>
  [ ...moveHistoryDOM,
    ...boardDOM ]

import { recordMove } from 'move-history/mutation'
import { moveHistoryDOM } from 'move-history/view'

export const moveHistory = (sources) => {
  const moveHistory$ = sources.propagation$.fold(recordMove, [])
  const moveHistoryDOM$ = moveHistory$.map(moveHistoryDOM)

  return {
    DOM: moveHistoryDOM$
  }
}

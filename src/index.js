import { run } from '@cycle/rxjs-run'
import { makeDOMDriver } from '@cycle/dom'
import { cyclifyComponent } from 'state-helpers'
import { withContainerDiv } from 'view-helpers'
import { board } from 'board'
import { withMoveHistory } from 'board/with-move-history'
import { withUndoTree } from 'undo-tree'

window.board = board

run(
  cyclifyComponent(
    withContainerDiv('.container')(
      withUndoTree('#undo', '#redo')(
        withMoveHistory(
          board
        )
      )
    )
  ),
  { DOM: makeDOMDriver('#free-the-clones') }
)

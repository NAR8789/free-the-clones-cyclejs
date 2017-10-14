import { run } from '@cycle/rxjs-run'
import { makeDOMDriver } from '@cycle/dom'
import { cyclifyComponent } from 'state-helpers'
import { containerDiv } from 'view-helpers'
import { board } from 'board'
import { withMoveHistory } from 'board/with-move-history'
import { undoTree } from 'undo-tree'

run(
  cyclifyComponent(
    containerDiv('.container')(
      undoTree('#undo', '#redo')(
        withMoveHistory(
          board
        )
      )
    )
  ),
  { DOM: makeDOMDriver('#free-the-clones') }
)

import { Observable } from 'rxjs/Rx'
import { concat } from 'ramda'
import * as Z from 'zipper'
import { localizeState } from 'state-helpers'
import { tagged } from 'intent-helpers'
import { undo, redo, snapshot } from 'undo-tree/mutation'
import { undoTreePresenter } from './presenter'
import { undoControls } from 'undo-tree/view'

export const withUndoTree = (undoSelector, redoSelector) => (baseComponentUnlocalized) => {
  const baseComponent = localizeState('current')(baseComponentUnlocalized)

  return {
    initialState: Z.from(baseComponent.initialState.current),
    sourcesToIntents: (sources) => Observable.merge(
      baseComponent
        .sourcesToIntents(sources)
        .concatMap(
          (taggedBaseIntent) => Observable.from([
            { tag: 'snapshot' },
            taggedBaseIntent,
          ])
        ),
      tagged('undo', sources.DOM.select(undoSelector).events('click')),
      tagged('redo', sources.DOM.select(redoSelector).events('click')),
    ),
    reducersForTag: {
      ...baseComponent.reducersForTag,
      undo: [undo],
      redo: [redo],
      snapshot: [snapshot],
    },
    statesToViews: (state) => {
      const undoTreePresenter$ = state.state$.map(undoTreePresenter)

      const baseComponentDOM$ = baseComponent.statesToViews(state).DOM
      const undoControlsDOM$ = undoTreePresenter$.map(undoControls(undoSelector, redoSelector))
      return { DOM: Observable.combineLatest(
        baseComponentDOM$,
        undoControlsDOM$,
        concat
      )}
    }
  }
}

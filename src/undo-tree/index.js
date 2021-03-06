import { Observable } from 'rxjs/Rx'
import { concat } from 'ramda'
import * as T from 'tree'
import { localizeState } from 'state-helpers'
import { tagged } from 'intent-helpers'
import { undo, redo, next, prev, snapshot } from 'undo-tree/mutation'
import { undoTreePresenter } from './presenter'
import { undoControls } from 'undo-tree/view'

export const withUndoTree = (undoSelector, redoSelector, nextSelector, prevSelector) => (baseComponentUnlocalized) => {
  const baseComponent = localizeState('val')(baseComponentUnlocalized)

  return {
    initialState: T.from(baseComponent.initialState.val),
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
      tagged('next', sources.DOM.select(nextSelector).events('click')),
      tagged('prev', sources.DOM.select(prevSelector).events('click')),
    ),
    reducersForTag: {
      ...baseComponent.reducersForTag,
      undo: [undo],
      redo: [redo],
      next: [next],
      prev: [prev],
      snapshot: [snapshot],
    },
    statesToViews: (state) => {
      const undoTreePresenter$ = state.state$.map(undoTreePresenter)

      const baseComponentDOM$ = baseComponent.statesToViews(state).DOM
      const undoControlsDOM$ = undoTreePresenter$.map(undoControls(undoSelector, redoSelector, nextSelector, prevSelector))
      return { DOM: Observable.combineLatest(
        baseComponentDOM$,
        undoControlsDOM$,
        concat
      )}
    }
  }
}

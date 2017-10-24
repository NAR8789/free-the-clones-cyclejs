import { Observable } from 'rxjs/Rx'
import { values } from 'ramda'
import { localizeState } from 'state-helpers'
import { undo, redo, snapshot } from 'undo-tree/mutation'
import { withUndoRedo } from 'undo-tree/view'

export const withUndoTree = (undoSelector, redoSelector) => (baseComponentUnlocalized) => {
  const baseComponent = localizeState('currentBaseState')(baseComponentUnlocalized)

  return {
    initialState: {
      prevBaseStates: [],
      ...baseComponent.initialState,
      nextBaseStates: []
    },
    sourcesToIntents: (sources) => {
      const baseIntents = baseComponent.sourcesToIntents(sources)
      const snapshotIntent$ = Observable.merge(...values(baseIntents))
      // TODO: I think as written this still lacks order guarantees on when snapshot fires compared to other intents
      // I think to ensure order, I need to generate a unified event stream, with snapshot intents inserted in the
      // desired order, and then filter everything back out.
      //
      // Maybe I should just run with the selector metaphor, and generate tagged intents filterable by selectors?
      // This would be more in line both with how cycle already works, and to be honest probably simplify the namespacing
      // compared to the maps I'm using here.

      const undoIntent$ = sources.DOM.select(undoSelector).events('click')
      const redoIntent$ = sources.DOM.select(redoSelector).events('click')

      return {
        ...baseIntents,
        snapshotIntent$,
        undoIntent$,
        redoIntent$
      }
    },
    intentsToReducers: {
      ...baseComponent.intentsToReducers,
      undoIntent$: [undo],
      redoIntent$: [redo],
      snapshotIntent$: [snapshot],
    },
    statesToViews: (state) => {
      const baseComponentDOM$ = baseComponent.statesToViews(state).DOM
      const withUndoControlsDOM$ = baseComponentDOM$.map(withUndoRedo(undoSelector, redoSelector))
      return { DOM: withUndoControlsDOM$ }
    }
  }
}

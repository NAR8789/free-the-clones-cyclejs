import xs from 'xstream'
import { localizeComponent } from 'state-helpers'
import { undo, redo, regularDo } from 'undo-tree/mutation'
import { withUndoRedo } from 'undo-tree/view'

export const undoTree = (undoSelector, redoSelector) => (baseComponentUnlocalized) => {
  const baseComponent = localizeComponent('currentBaseState')(baseComponentUnlocalized)

  return {
    initialState: {
      prevBaseStates: [],
      ...baseComponent.initialState,
      nextBaseStates: []
    },
    stateProgression: (sources) => {
      const regularDoReducer$ = baseComponent
        .stateProgression(sources)
        .reducer$
        .map(regularDo)

      const undoClick$ = sources.DOM.select(undoSelector).events('click')
      const redoClick$ = sources.DOM.select(redoSelector).events('click')
      const undoReducer$ = undoClick$.map(undo)
      const redoReducer$ = redoClick$.map(redo)

      return { reducer$: xs.merge(
        undoReducer$,
        redoReducer$,
        regularDoReducer$,
      ) }
    },
    viewProgression: (state) => {
      state.state$.subscribe({next: console.log})
      const baseComponentDOM$ = baseComponent.viewProgression(state).DOM
      const withUndoControlsDOM$ = baseComponentDOM$.map(withUndoRedo(undoSelector, redoSelector))
      return { DOM: withUndoControlsDOM$ }
    }
  }
}

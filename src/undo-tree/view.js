import { div, button } from '@cycle/dom'

export const withUndoRedo = (undoSelector, redoSelector) => (baseDOM) =>
  [ ...baseDOM,
    div('#undo-controls', [
      button(undoSelector, 'Undo'),
      button(redoSelector, 'Redo'),
    ]) ]

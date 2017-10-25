import { div, button } from '@cycle/dom'

export const undoControls = (undoSelector, redoSelector) => (undoTree) =>
  [div('#undo-controls', [
    button(undoSelector, {attrs: {disabled: undoTree.undoable ? false : 'true'}}, 'Undo'),
    button(redoSelector, {attrs: {disabled: undoTree.redoable ? false : 'true'}}, 'Redo'),
  ])]

import { div, button } from '@cycle/dom'

export const undoControls = (undoSelector, redoSelector, nextSelector, prevSelector) => (undoTree) =>
  [div('#undo-controls', [
    button(undoSelector, {attrs: {disabled: undoTree.undoable ? false : 'true'}}, 'Undo'),
    button(redoSelector, {attrs: {disabled: undoTree.redoable ? false : 'true'}}, 'Redo'),
    button(nextSelector, {attrs: {disabled: undoTree.nextable ? false : 'true'}}, 'Next'),
    button(prevSelector, {attrs: {disabled: undoTree.prevable ? false : 'true'}}, 'Prev'),
  ])]

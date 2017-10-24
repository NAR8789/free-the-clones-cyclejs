import { div, button } from '@cycle/dom'

export const undoControls = (undoSelector, redoSelector) => (undoTree) =>
  [div('#undo-controls', [
    button(undoSelector, {attrs: {disabled: undoTree.undoDisabled}}, 'Undo'),
    button(redoSelector, {attrs: {disabled: undoTree.redoDisabled}}, 'Redo'),
  ])]

export const withUndoRedo = (undoSelector, redoSelector) => (baseDOM) =>
  [ ...baseDOM,
    div('#undo-controls', [
      button(undoSelector, {attrs: {disabled: 'true'}}, 'Undo'),
      button(redoSelector, {attrs: {disabled: undefined}}, 'Redo'),
    ]) ]

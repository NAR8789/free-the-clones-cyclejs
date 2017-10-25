import * as T from 'tree'

export const undo = (_intent) => (undoTree) =>
  T.hasParent(undoTree) ? T.up(undoTree) : undoTree

export const redo = (_intent) => (undoTree) =>
  T.hasChildren(undoTree) ? T.down(undoTree) : undoTree

export const snapshot = (_intent) => (undoTree) =>
  T.insert(undoTree.val)(undoTree)

import * as T from 'tree'

export const undo = (_) => (undoTree) =>
  T.hasParent(undoTree) ? T.up(undoTree) : undoTree

export const redo = (_) => (undoTree) =>
  T.hasChildren(undoTree) ? T.down(undoTree) : undoTree

export const next = (_) => (undoTree) =>
  T.hasNextChild(undoTree)
    ? T.nextChild(undoTree)
    : undoTree

export const prev = (_) => (undoTree) =>
  T.hasPrevChild(undoTree)
    ? T.prevChild(undoTree)
    : undoTree

export const snapshot = (_) => (undoTree) =>
  T.insert(undoTree.val)(undoTree)

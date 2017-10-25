import * as Z from 'zipper'

export const undo = (_intent) => (undoZipper) =>
  Z.hasPrev(undoZipper) ? Z.prev(undoZipper) : undoZipper

export const redo = (_intent) => (undoZipper) =>
  Z.hasNext(undoZipper) ? Z.next(undoZipper) : undoZipper

export const snapshot = (_intent) => (undoZipper) =>
  Z.insert(undoZipper.current)(undoZipper)

import * as T from 'tree'

export const undoTreePresenter = (undoTree) => {
  const undoable = T.hasParent(undoTree)
  const redoable = T.hasChildren(undoTree)

  return {
    ...undoTree,
    undoable,
    redoable,
  }
}

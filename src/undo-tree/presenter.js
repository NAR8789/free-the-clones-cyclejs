import * as T from 'tree'

export const undoTreePresenter = (undoTree) => {
  const undoable = T.hasParent(undoTree)
  const redoable = T.hasChildren(undoTree)
  const nextable = T.hasNextChild(undoTree)
  const prevable = T.hasPrevChild(undoTree)

  return {
    ...undoTree,
    undoable,
    redoable,
    nextable,
    prevable
  }
}

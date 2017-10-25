import * as T from 'tree'

export const undoTreePresenter = (undoTree) => {
  const undoable = T.hasParent(undoTree)
  const redoable = T.hasChildren(undoTree)
  const undoDisabled = undoable ? false : 'true'
  const redoDisabled = redoable ? false : 'true'

  return {
    ...undoTree,
    undoable,
    redoable,
    undoDisabled,
    redoDisabled,
  }
}

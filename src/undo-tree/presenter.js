import * as Z from 'zipper'

export const undoTreePresenter = (undoTree) => {
  const undoable = Z.hasPrev(undoTree)
  const redoable = Z.hasNext(undoTree)
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

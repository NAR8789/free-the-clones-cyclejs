export const undoTreePresenter = (undoTree) => {
  const undoable = undoTree.prevBaseStates.length > 0
  const redoable = undoTree.nextBaseStates.length > 0
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

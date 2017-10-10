export const curriedRecordMove = (propagation) => (moveHistory) => [...moveHistory, propagation]

export const recordMove = (moveHistory, propagation) => curriedRecordMove(propagation)(moveHistory)

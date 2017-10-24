export const undo = (_intent) => (prevState) => {
  const {
    prevBaseStates: [prevBaseState, ...earlierBaseStates],
    currentBaseState,
    nextBaseStates
  } = prevState

  if (typeof prevBaseState === 'undefined') { return prevState }

  return {
    prevBaseStates: earlierBaseStates,
    currentBaseState: prevBaseState,
    nextBaseStates: [currentBaseState, ...nextBaseStates]
  }
}

export const redo = (_intent) => (prevState) => {
  const {
    prevBaseStates,
    currentBaseState,
    nextBaseStates: [nextBaseState, ...laterBaseStates]
  } = prevState

  if (typeof nextBaseState === 'undefined') { return prevState }

  return {
    prevBaseStates: [currentBaseState, ...prevBaseStates],
    currentBaseState: nextBaseState,
    nextBaseStates: laterBaseStates
  }
}

export const snapshot = (_intent) => ({prevBaseStates, currentBaseState, nextBaseStates}) => ({
  prevBaseStates: [currentBaseState, ...prevBaseStates],
  currentBaseState,
  nextBaseStates: [],
})

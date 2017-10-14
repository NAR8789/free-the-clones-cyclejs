import { div } from '@cycle/dom'

export const containerDiv = (sel) => ({initialState, stateProgression, viewProgression}) => ({
  initialState,
  stateProgression,
  viewProgression: state => ({ DOM: viewProgression(state).DOM.map(baseDOM => div(sel, baseDOM)) })
})

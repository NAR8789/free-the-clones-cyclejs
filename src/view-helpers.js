import { div } from '@cycle/dom'

export const withContainerDiv = (sel) => ({initialState, sourcesToIntents, intentsToReducers, statesToViews}) => ({
  initialState,
  sourcesToIntents,
  intentsToReducers,
  statesToViews: state => ({ DOM: statesToViews(state).DOM.map(baseDOM => div(sel, baseDOM)) })
})

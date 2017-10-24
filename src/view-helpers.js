import { div } from '@cycle/dom'

export const withContainerDiv = (sel) => ({statesToViews, ...rest}) => ({
  statesToViews: state => ({ DOM: statesToViews(state).DOM.map(baseDOM => div(sel, baseDOM)) }),
  ...rest
})

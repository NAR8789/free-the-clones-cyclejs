import { Observable } from 'rxjs/Rx'
import { unnest, merge, mergeWith, union } from 'ramda'

export const combineIndependent = (...components) => ({
  initialState: merge(...components.map(component => component.initialState)),
  sourcesToIntents: sources => (
    merge(...components.map((component) => component.sourcesToIntents(sources)))
  ),
  intentsToReducers: mergeWith(union, ...components.map(component => component.intentsToReducers)),
  statesToViews: sources => ({
    DOM: Observable.combineLatest(
      ...components
        .map(component => component.statesToViews)
        .map(statesToViews => statesToViews(sources))
        .map(({DOM}) => DOM), // remember that DOM is a stream
      (...DOMs) => unnest(DOMs)
    ),
  })
})

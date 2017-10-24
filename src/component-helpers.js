import { Observable } from 'rxjs/Rx'
import { unnest, merge, mergeWith, union } from 'ramda'

export const combineIndependent = (...components) => ({
  initialState: merge(...components.map(component => component.initialState)),
  sourcesToIntents: sources => (
    Observable.merge(...components.map((component) => component.sourcesToIntents(sources)))
  ),
  reducersForTag: mergeWith(union, ...components.map(component => component.reducersForTag)),
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

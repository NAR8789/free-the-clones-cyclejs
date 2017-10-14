import { Observable } from 'rxjs/Rx'
import flatten from 'lodash/fp/flatten'

export const combineIndependent = (...components) => ({
  initialState: Object.assign({}, ...components.map(component => component.initialState)),
  stateProgression: sources => ({
    reducer$: Observable.merge(
      components
        .map(component => component.stateProgression)
        .map(stateProgression => stateProgression(sources))
        .map(({reducer$}) => reducer$)
    )
  }),
  viewProgression: sources => ({
    DOM: Observable.combineLatest(
      ...components
        .map(component => component.viewProgression)
        .map(viewProgression => viewProgression(sources))
        .map(({DOM}) => DOM), // remember that DOM is a stream
      (...DOMs) => flatten(DOMs)
    ),
  })
})

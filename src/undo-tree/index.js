import { Observable } from 'rxjs/Rx'
import { keys, fromPairs } from 'ramda'
import { localizeState } from 'state-helpers'
import { undo, redo, snapshot } from 'undo-tree/mutation'
import { withUndoRedo } from 'undo-tree/view'

export const withUndoTree = (undoSelector, redoSelector) => (baseComponentUnlocalized) => {
  const baseComponent = localizeState('currentBaseState')(baseComponentUnlocalized)

  return {
    initialState: {
      prevBaseStates: [],
      ...baseComponent.initialState,
      nextBaseStates: []
    },
    sourcesToIntents: (sources) => {
      const baseIntents = baseComponent.sourcesToIntents(sources)
      const baseIntentNames = keys(baseIntents)
      const taggedUnifiedBaseIntent$ =
        Observable.merge(
          ...baseIntentNames.map(intentName =>
            baseIntents[intentName].map(intent => ({ intentName, intent }))
          )
        ).concatMap(
          (taggedBaseIntent) => Observable.from([
            { intentName: 'snapshotIntent$', intent: undefined },
            taggedBaseIntent,
            { intentName: 'dummyIntent$', intent: undefined },
          ])
        )
      taggedUnifiedBaseIntent$.subscribe(console.log)
      const mapifiedIntent$s = fromPairs(
        ['snapshotIntent$', ...baseIntentNames].map(baseIntentName =>
          [baseIntentName,
            taggedUnifiedBaseIntent$.filter(({intentName}) =>
              intentName === baseIntentName
            ).map(({intent}) => intent)]
        )
      )

      const taggedUnifiedBaseIntent$2 =
        Observable.merge(
          ...keys(mapifiedIntent$s).map(intentName =>
            mapifiedIntent$s[intentName].map(intent => ({ intentName, intent }))
          )
        )
      taggedUnifiedBaseIntent$2.subscribe(console.log)

      const undoIntent$ = sources.DOM.select(undoSelector).events('click')
      const redoIntent$ = sources.DOM.select(redoSelector).events('click')

      return {
        ...mapifiedIntent$s,
        undoIntent$,
        redoIntent$
      }
    },
    intentsToReducers: {
      ...baseComponent.intentsToReducers,
      undoIntent$: [undo],
      redoIntent$: [redo],
      snapshotIntent$: [snapshot],
    },
    statesToViews: (state) => {
      const baseComponentDOM$ = baseComponent.statesToViews(state).DOM
      const withUndoControlsDOM$ = baseComponentDOM$.map(withUndoRedo(undoSelector, redoSelector))
      return { DOM: withUndoControlsDOM$ }
    }
  }
}

import { Observable } from 'rxjs/Rx'
import { concat, keys, fromPairs } from 'ramda'
import { localizeState } from 'state-helpers'
import { undo, redo, snapshot } from 'undo-tree/mutation'
import { undoTreePresenter } from './presenter'
import { undoControls } from 'undo-tree/view'

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
      const mapifiedIntent$s = fromPairs(
        ['snapshotIntent$', ...baseIntentNames].map(baseIntentName =>
          [baseIntentName,
            taggedUnifiedBaseIntent$.filter(({intentName}) =>
              intentName === baseIntentName
            ).map(({intent}) => intent)]
        )
      )

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
      const undoTreePresenter$ = state.state$.map(undoTreePresenter)

      const baseComponentDOM$ = baseComponent.statesToViews(state).DOM
      const undoControlsDOM$ = undoTreePresenter$.map(undoControls(undoSelector, redoSelector))
      return { DOM: Observable.combineLatest(
        baseComponentDOM$,
        undoControlsDOM$,
        concat
      )}
    }
  }
}

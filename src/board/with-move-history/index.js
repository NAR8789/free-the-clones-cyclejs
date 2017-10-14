import { Observable } from 'rxjs/Rx'
import { localizeComponent } from 'state-helpers'
import { moveHistory as moveHistoryUnlocalized } from 'board/move-history'
import { combineIndependent } from 'component-helpers'

export const withMoveHistory = (boardUnlocalized) => {
  const board = localizeComponent('board')(boardUnlocalized)
  const moveHistory = localizeComponent('moveHistory')(moveHistoryUnlocalized)

  return {
    ...combineIndependent(board, moveHistory),
    stateProgression: (sources) => {
      const { reducer$: boardReducer$, propagationIntent$ } = board.stateProgression(sources)
      const { reducer$: moveHistoryReducer$ } = moveHistory.stateProgression({ propagationIntent$ })

      // HACK: I use `zip` to make the reducer stream undo-friendly by combining board and history
      // updates into single reducers in pairs. This will not generalize to any case with truly independent
      // reducer streams.
      return {
        reducer$: Observable.zip(boardReducer$, moveHistoryReducer$,
          (boardReducer, moveHistoryReducer) => (state) => moveHistoryReducer(boardReducer(state)))
      }
      // To clarify, I think combining reducers _is_ the right thing to do here--it is actually
      // counterintuitive for board update and moveHistory updates to happen independently for the same
      // move. However, `zip`ping only works here because in this case the system has only a single
      // intent stream. Were the board updates and history updates actually able to happen independently
      // based on *independent user actions*, `zip` would do terrible things like block reactivity.
      //
      // In the case of multiple intent streams, reducers should be grouped by source intent. A single
      // event from the intents will then correspond to a single event on the global `state$`. Final state
      // will be identical, but I will find it easier to reason about system behavior if `state$` events
      // line up with "user actions".
      //
      // Unfortunately, I can't figure out any good way to do this grouping after I have already spilt the
      // data flow into multiple reducer streams. I think we have to catch the stream earlier, at the
      // level of intent streams, and I think this naturally leads to a flux-dispatcher-like pattern:
      // - instead of exporting a `reducer$`, we export the `intent$`, and the state manager will look up
      //   the corresponding reducers and apply them atomically to the state stream.
      // - Since the state manager is now in charge of wiring up the updates, reducers must be registered
      //   with the state manager.
      // - In order for the state manager to look up the correct reducers for a given intent, we also need
      //   a way of mapping intents to reducers. Here finally I think maybe we can do better than flux and
      //   redux...
      //   - In flux and redux the individual intent events are flagged with a "type", and this is
      //     essentially used to pick "which reducer(s)".
      //   - Instead, we can publish
      //     - named reducers/mutations (e.g. `propagate(...)`, `recordMove(...)`),
      //     - named intent streams (e.g. `propagationIntent$`)
      //     - and a mapping to register mutations to intent$s. (possibly something like
      //       `{ propagationIntent$: ['propagate', 'recordMove'] }`)
      //   I say "better", but at the end of the day this really just shuffles the namespacing around,
      //   extracting action-mapping boilerplate from functions into maps. I happen to like the latter
      //   better, but code verbosity and mental load will probably be similar.
    },
  }
}

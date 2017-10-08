import xs from 'xstream'
import {run} from '@cycle/run'
import {div, span, makeDOMDriver} from '@cycle/dom'

const main = (sources) => {
  const board$ = xs.from(
    [[
      [true, true],
      [true, false]
    ]])

  const vdom$ = board$.map(
    board => div('.board', board.map(
      row => div('.row', row.map(
        square => span('.square.fa-circle', { class: { pebble: square } })
      ))
    ))
  )
  return {
    DOM: vdom$
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

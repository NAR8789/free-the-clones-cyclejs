import xs from 'xstream'
import {run} from '@cycle/run'
import {p, makeDOMDriver} from '@cycle/dom'

const main = (whee) => {
  return {
    DOM: xs.from([p('hello world!')])
  }
}

const drivers = {
  DOM: makeDOMDriver('#free-the-clones'),
}

run(main, drivers)

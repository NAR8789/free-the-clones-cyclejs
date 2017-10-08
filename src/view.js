import {div, span} from '@cycle/dom'

export const boardDOM = (boardPresenter) =>
  div('.board', boardPresenter.map(row =>
    div('.row', row.map(({ pebble, clonable, location: [i, j] }) =>
      span('.square.fa-circle', {
        class: { pebble, clonable },
        attrs: { 'data-i': i, 'data-j': j }
      })
    ))
  ))

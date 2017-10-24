import { div, span } from '@cycle/dom'

export const boardDOM = (boardPresenter) =>
  [ div('#board', div('.board', boardPresenter.map(row =>
    div('.row', row.map(({ pebble, clonable, location }) =>
      span('.square.fa-circle', {
        class: { pebble, clonable },
        attrs: { 'data-location': JSON.stringify(location) }
      })
    ))
  ))) ]

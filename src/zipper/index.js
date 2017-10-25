export const next = ({prev, current, next: [immediateNext, ...later]}) => ({
  prev: [current, ...prev],
  current: immediateNext,
  next: later
})

export const prev = ({prev: [immediatePrev, ...earlier], current, next}) => ({
  prev: earlier,
  current: immediatePrev,
  next: [current, ...next]
})

export const hasNext = ({next}) => next.length > 0

export const hasPrev = ({prev}) => prev.length > 0

export const insert = (val) => ({prev, current, next}) => ({
  prev: [current, ...prev],
  current: val,
  next
})

export const insertRight = (val) => ({prev, current, next}) => ({
  prev,
  current: val,
  next: [current, ...next]
})

export const from = (val) => ({prev: [], current: val, next: []})

export const insertOrCreate = (val) => (tree) => {
  if (tree === undefined || tree === null) {
    return from(val)
  } else {
    return insert(val)(tree)
  }
}

export const clearNext = ({prev, current, next}) => ({prev, current, next: []})

export const update = (updater) => ({current, ...navStacks}) => ({current: updater(current), ...navStacks})

export const toEnd = (zipper) => hasNext(zipper) ? toEnd(next(zipper)) : zipper

export const toHead = (zipper) => hasPrev(zipper) ? toHead(prev(zipper)) : zipper

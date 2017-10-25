import { pipe } from 'ramda'
import * as Z from 'zipper'

export const from = (val) => ({
  val: val,
})

export const hasChildren = ({children}) => children !== undefined && children !== null

export const hasParent = ({parent}) => parent !== undefined && parent !== null

export const addChild = (childVal) => ({parent, val, children}) =>
  ({parent, val, children: Z.insertOrCreate(from(childVal))(children)})

export const up = ({parent: {parent, val, childrenPrev, childrenNext}, val: childVal, children: grandChildren}) => ({
  parent,
  val,
  children: {
    prev: childrenPrev,
    current: { val: childVal, children: grandChildren },
    next: childrenNext,
  }
})

export const down = ({parent: grandParent, val: parentVal, children: {prev, current: {val, children}, next}}) => ({
  parent: {parent: grandParent, val: parentVal, childrenPrev: prev, childrenNext: next},
  val,
  children
})

export const focusYoungestChild = ({parent, val, children}) => children === undefined || children === null
  ? ({parent, val, children})
  : ({parent, val, children: Z.toEnd(children)})

export const insert = (val) => pipe(
  focusYoungestChild,
  addChild(val),
  down
) // (tree)

export const toRoot = (tree) => hasParent(tree) ? toRoot(up(tree)) : tree

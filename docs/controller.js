/* global fetch */
import model from './model.js'
import { ENROLLED } from './constants.js'

export function memoize (map, v, f) {
  if (!map.has(v)) {
    map.set(v, f(v))
  }
  return map.get(v)
}
const courseMap = new Map()
export const memoizeCourse = (v, f) => memoize(courseMap, v, f)

async function init () {
  const config = await (await fetch('./catalog.json')).json()
  model.catalog = config.catalog
}
init()

const setView = () => {
  model.hash = document.location.hash || ENROLLED
}
window.addEventListener('load', setView)
window.addEventListener('hashchange', setView)

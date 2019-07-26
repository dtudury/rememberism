/* global fetch */
import model from './model.js'
import { ENROLLED, UNENROLLED, ALL } from './constants.js'

async function _setCourse (course) {
  let location = model.catagory
  if (course) {
    location = `${location}/${encodeURIComponent(course)}`
  }
  if (document.location !== location) {
    document.location = location
    if (course) {
      document.title = course
      model.course = course
      location = `${location}/${encodeURIComponent(course)}`
      const catalog = await _fetchCatalog()
      await _installComponent(`./components/${catalog[course].component}.js`)
      model.cards = await _fetchJson(`/courses/${catalog[course].course}`)
    } else {
      document.title = 'Rememberism'
      model.course = null
      model.cards = null
    }
  }
}

export function beginCourse (course) {
  return e => _setCourse(course)
}

export function leaveCourse () {
  _setCourse(null)
}

export function memoize (map, v, f) {
  if (!map.has(v)) {
    map.set(v, f(v))
  }
  return map.get(v)
}
const _courseMap = new Map()
export const memoizeCourse = (v, f) => memoize(_courseMap, v, f)

const _fetchMap = new Map()
async function _fetchJson (path) {
  if (!_fetchMap.has(path)) {
    _fetchMap.set(path, fetch(path).then(res => res.json()))
  }
  return _fetchMap.get(path)
}
const _fetchCatalog = () => _fetchJson('./catalog.json')
_fetchCatalog().then(catalog => { model.catalog = catalog })

const installMap = new Map()
async function _installComponent (path) {
  if (!installMap.has(path)) {
    installMap.set(path, import(path))
  }
  return installMap.get(path)
}

const readHash = () => {
  const slashIndex = document.location.hash.indexOf('/')
  let preSlash = document.location.hash
  let postSlash
  if (slashIndex !== -1) {
    preSlash = document.location.hash.substring(0, slashIndex)
    postSlash = document.location.hash.substring(slashIndex + 1)
  }
  if (preSlash === UNENROLLED) {
    model.catagory = UNENROLLED
  } else if (preSlash === ALL) {
    model.catagory = ALL
  } else {
    model.catagory = ENROLLED
  }
  _setCourse(postSlash && decodeURIComponent(postSlash))
}
window.addEventListener('load', readHash)
window.addEventListener('hashchange', readHash)

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
      model.course = course
      document.title = course
      location = `${location}/${encodeURIComponent(course)}`
      const config = await fetchJson('./catalog.json')
      model.cards = await fetchJson(config.catalog[course].data)
    } else {
      model.course = null
      document.title = 'Rememberism' // model.catagory.substring(1)
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
const courseMap = new Map()
export const memoizeCourse = (v, f) => memoize(courseMap, v, f)

const fetchMap = new Map()
async function fetchJson (path) {
  if (!fetchMap.has(path)) {
    fetchMap.set(path, fetch(path).then(res => res.json()))
  }
  return fetchMap.get(path)
}

async function init () {
  const config = await fetchJson('./catalog.json')
  model.catalog = config.catalog
}
init()

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

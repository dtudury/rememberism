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
      model.cards = await _fetchJson(`/courses/${catalog[course].json}`)
      _setTesting(Date.now())
    } else {
      document.title = 'Rememberism'
      model.course = null
      model.cards = null
      model.testing = null
    }
  }
}

export function getScore (title) {
  const courseProgress = model.progress[model.course]
  const progress = courseProgress && courseProgress[title]
  if (progress) {
    if (!progress.due || !progress.start) {
      return 0
    } else {
      return (progress.due - progress.start) / (model.now - progress.start)
    }
  }
  return -1
}

function _setTesting (now) {
  model.now = now
  let bestTitle
  let bestScore
  Object.keys(model.cards || {}).forEach(title => {
    const score = getScore(title)
    if (score < 1 && (!bestTitle || (score >= 0 && score <= bestScore))) {
      bestTitle = title
      bestScore = score
    }
  })
  model.testing = bestTitle
}

export function beginCourse (course) {
  return e => _setCourse(course)
}

export function leaveCourse () {
  _setCourse(null)
}

export function ongrade (course, title, isCorrect, e) {
  e.stopPropagation()
  const courseProgress = model.progress[course] = (model.progress[course] || {})
  const progress = courseProgress[title] = (courseProgress[title] || {})
  const now = Date.now()
  if (isCorrect) {
    progress.start = progress.start || now
    progress.due = Math.round(now + Math.max((now - progress.start) * (1 + Math.sqrt(5)) / 2, 1)) // golden ratio
    progress.count = (progress.count || 0) + 1
  } else {
    delete progress.start
    delete progress.due
    delete progress.count
  }
  _setTesting(now)
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

const _installMap = new Map()
async function _installComponent (path) {
  if (!_installMap.has(path)) {
    _installMap.set(path, import(path))
  }
  return _installMap.get(path)
}

const _readHash = () => {
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
window.addEventListener('load', _readHash)
window.addEventListener('hashchange', _readHash)

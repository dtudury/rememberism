/* global fetch */
import model from './model.js'
import { watchFunction } from 'https://unpkg.com/horseless/dist/horseless.esm.js'

export async function setCourse (catalogPath, courseName) {
  model.catalogPath = catalogPath
  model.courseName = courseName
  /*
  let location = `#${encodeURIComponent(model.catalog)}`
  if (course) {
    location = `${location}/${encodeURIComponent(course)}`
  }
  if (document.location !== location) {
    document.location = location
    if (course) {
      document.title = course
      model.course = course
      const catalog = await _installCatalog(course)
      await _installComponent(`./components/${catalog[course].component}.js`)
      model.cards = await _getCourse(`/courses/${catalog[course].json}`)
      _setTesting(Date.now())
    } else {
      document.title = 'Rememberism'
      model.course = null
      model.cards = null
      model.testing = null
    }
  }
  */
}
_setFromHash()
watchFunction(() => {
  let hash = encodeHash(model.catalogPath, model.courseName)
  if (document.location.hash !== hash) {
    document.location.hash = hash
    const catalog = model.catalogPath && model.catalogs[model.catalogPath]
    _setTesting(Date.now())
    if (model.courseName) {
      document.title = model.courseName
    } else if (catalog) {
      document.title = model.catalogs[model.catalogPath].name
    } else {
      document.title = 'Rememberism'
    }
  }
})

export function getScore (title) {
  const course = model.progress[model.courseName]
  const progress = course && course[title]
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

export function beginCourse (catalogPath, courseName) {
  return e => setCourse(catalogPath, courseName)
}

export function ongrade (catalogPath, courseName, title, isCorrect, e) {
  e.stopPropagation()
  const catalog = model.progress[catalogPath] = (model.progress[catalogPath] || {})
  const courses = catalog.courses = (catalog.courses || {})
  const course = courses[courseName] = (courses[courseName] || {})
  const cards = course.cards = (course.cards || {})
  const progress = cards[title] = (cards[title] || {})
  const now = Date.now()
  if (isCorrect) {
    progress.start = progress.start || now
    progress.due = Math.round(now + Math.max((now - progress.start) * (1 + Math.sqrt(5)) / 2, 2000)) // golden ratio
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
async function _fetchJson (path, initialize) {
  if (!_fetchMap.has(path)) {
    _fetchMap.set(path, fetch(path).then(res => res.json()).then(obj => {
      if (initialize) {
        initialize(obj)
      }
      return obj
    }))
  }
  return _fetchMap.get(path)
}

export function encodeHash (catalogPath, courseName) {
  if (catalogPath) {
    const hash = `#${encodeURIComponent(catalogPath)}`
    if (courseName) {
      return `${hash}/${encodeURIComponent(courseName)}`
    }
    return hash
  }
  return ''
}

export function decodeHash (hash) {
  let preSlash = hash.substr(1)
  let postSlash = ''
  const slashIndex = preSlash.indexOf('/')
  if (slashIndex !== -1) {
    postSlash = preSlash.substring(slashIndex + 1)
    preSlash = preSlash.substring(0, slashIndex)
  }
  return { catalogPath: decodeURIComponent(preSlash) || false, courseName: decodeURIComponent(postSlash) || false }
}

function _setFromHash () {
  const { catalogPath, courseName } = decodeHash(document.location.hash)
  setCourse(catalogPath, courseName)
}

window.addEventListener('load', _setFromHash)
window.addEventListener('hashchange', _setFromHash)

watchFunction(() => {
  Object.keys(model.progress).forEach(catalogPath => {
    _fetchJson(catalogPath, catalog => {
      const courses = catalog.courses
      Object.keys(courses).forEach(courseName => {
        const cards = courses[courseName].cards
        Object.keys(cards).forEach(index => {
          cards[index] = { data: cards[index] } // force this to be an object (strings won't work)
        })
      })
    }).then(catalog => {
      model.catalogs[catalogPath] = catalog
    })
  })
})

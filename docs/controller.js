/* global fetch */
import model, { getReferences, getScore, sortedTitles } from './model.js'
import { watchFunction } from 'https://unpkg.com/horseless/dist/horseless.esm.js'

export async function setCourse (catalogPath, courseName) {
  model.catalogPath = catalogPath
  model.courseName = courseName
}

function _setTesting (now) {
  model.now = now
  const sorted = sortedTitles()
  let bestTitle = sorted[0]
  let bestScore
  sorted.forEach(title => {
    const score = getScore(title)
    if ((bestScore === undefined || bestScore < 0) && score < 1) {
      bestTitle = title
      bestScore = score
    }
  })
  model.testing = bestTitle
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
  return {
    catalogPath: decodeURIComponent(preSlash) || false,
    courseName: decodeURIComponent(postSlash) || false
  }
}

function installCatalog (catalogPath) {
  if (!model.catalogs[catalogPath]) {
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
  }
}

function _setFromHash () {
  const { catalogPath, courseName } = decodeHash(document.location.hash)
  setCourse(catalogPath, courseName)
}

window.addEventListener('load', _setFromHash)
window.addEventListener('hashchange', _setFromHash)
_setFromHash()

// install any missing catalogs
watchFunction(() => {
  Object.keys(model.progress).forEach(installCatalog)
  installCatalog(model.catalogPath)
})

// update hash and title based on catalogPath and courseName
watchFunction(() => {
  const hash = encodeHash(model.catalogPath, model.courseName)
  if (document.location.hash !== hash) {
    document.location.hash = hash
    const { catalog } = getReferences()
    const catalogTitle = catalog.name
    document.title = model.courseName || catalogTitle || 'Rememberism'
    _setTesting(Date.now())
  }
})

// set default catalogPath and courseName when not set
watchFunction(() => {
  if (!model.catalogPath) {
    Object.keys(model.progress).some(catalogPath => {
      const catalog = model.progress[catalogPath]
      if (catalog.courses) {
        return Object.keys(catalog.courses).some(courseName => {
          if (courseName) {
            setCourse(catalogPath, courseName)
            return true
          }
          return false
        })
      }
      return false
    })
  }
})

// set default card
watchFunction(() => {
  if (!model.testing) {
    _setTesting(Date.now())
  }
})

/* global fetch */
import model, { getReferences, getScore, sortedTitles, decodeHash, encodeHash } from './model.js'
import { watchFunction } from 'https://unpkg.com/horseless/dist/horseless.esm.js'

function _setTesting (now) {
  model.now = now
  const sorted = sortedTitles()
  let bestTitle = sorted[0]
  let bestScore
  sorted.forEach(title => {
    const score = getScore(title)
    // set the last unknown card or the first maybe card
    // (the only time a probably card is set is if it's the first card because there's no non-probably cards)
    if ((bestScore === undefined || bestScore < 0) && score < 1) {
      bestTitle = title
      bestScore = score
    }
  })
  model.testing = bestTitle
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

function _installCatalog (catalogPath) {
  if (catalogPath && !model.catalogs[catalogPath]) {
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
  if (catalogPath === model.catalogPath && courseName === model.courseName) {
    setCourse(catalogPath, courseName, model.enrolled)
  } else {
    setCourse(catalogPath, courseName)
  }
}

window.addEventListener('load', _setFromHash)
window.addEventListener('hashchange', _setFromHash)
_setFromHash()

// install any missing catalogs
watchFunction(() => {
  Object.keys(model.progress).forEach(_installCatalog)
  _installCatalog(model.catalogPath)
})

// update hash and title based on catalogPath and courseName
watchFunction(() => {
  const hash = encodeHash(model.catalogPath, model.courseName)
  if (document.location.hash !== hash) {
    document.location.hash = hash
    const { catalog } = getReferences()
    const catalogTitle = catalog && catalog.name
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

export async function setCourse (catalogPath, courseName, enrolled) {
  model.catalogPath = catalogPath
  model.courseName = courseName
  model.enrolled = enrolled
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

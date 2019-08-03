import model from './model.js'
import { h } from '//unpkg.com/horseless/dist/horseless.esm.js'
import { ongrade } from './controller.js'

export function memoize (map, v, f) {
  if (!map.has(v)) {
    map.set(v, f(v))
  }
  return map.get(v)
}
const _courseMap = new Map()
export const memoizeCourse = (v, f) => memoize(_courseMap, v, f)
const _cardMap = new Map()
export const memoizeCard = (v, f) => memoize(_cardMap, v, f)

export function maybeSelected (el) {
  return (model.catagory === el.hash) ? 'selected' : ''
}

export function cardsOrCourses (cards, courses) {
  return () => {
    if (model.course) {
      return cards
    } else {
      return courses
    }
  }
}

function _getScore (title) {
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

function _calculateClass (title) {
  const score = _getScore(title)
  if (score > 1) {
    return 'card high'
  } else if (score >= 0) {
    return 'card low'
  } else {
    return 'card'
  }
}

export function sortedCards () {
  return Object.keys(model.cards || {}).map(title => {
    const card = model.cards[title]
    const courseConfig = model.catalog[model.course]
    const score = _getScore(title)
    const el = memoizeCard(card, card => h`<${courseConfig.component} 
      title=${title} 
      card=${card} 
      ongrade=${ongrade.bind(null, model.course, title)} 
      class=${() => _calculateClass(title)}
    />`)
    return { score, el }
  }).sort((a, b) => {
    return b.score - a.score
  }).map(bundle => bundle.el)
}

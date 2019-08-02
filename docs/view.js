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
export function sortedCards () {
  return Object.keys(model.cards || {}).map(title => {
    const card = model.cards[title]
    const courseConfig = model.catalog[model.course]
    function getUrgency () {
      const courseProgress = model.progress[model.course]
      const progress = courseProgress && courseProgress[title]
      if (progress) {
        if (progress.start && progress.due) {
          return (model.now - progress.start) / (progress.due - progress.start)
        }
        return Number.POSITIVE_INFINITY
      }
      return -1
    }
    function calculateClass () {
      const urgency = getUrgency()
      if (urgency >= 1) {
        return 'card due'
      } else if (urgency >= 0) {
        return 'card ok'
      } else {
        return 'card'
      }
    }
    const urgency = getUrgency()
    const el = memoizeCard(card, card => h`<${courseConfig.component} 
      title=${title} 
      card=${card} 
      ongrade=${ongrade.bind(null, model.course, title)} 
      class=${calculateClass} 
    />`)
    return { urgency, el }
  }).sort((a, b) => {
    return b.urgency - a.urgency
  }).map(bundle => bundle.el)
}

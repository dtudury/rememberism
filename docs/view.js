import model from './model.js'
import { h } from '//unpkg.com/horseless/dist/horseless.esm.js'

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
    const courseProgress = model.progress[model.course]
    const progress = courseProgress && courseProgress[title]
    if (model.now && progress && progress.c && progress.b) {
      progress.a = Math.max(1, (model.now - progress.c) * progress.b)
      progress.now = model.now
    }
    function ongrade (isCorrect) {
      console.log(model.course, title, card, isCorrect)
    }
    return {
      title,
      a: progress && progress.a,
      h: memoizeCard(card, card => h`<${courseConfig.component} title=${title} card=${card} ongrade=${ongrade} class="card" />`)
    }
  }).sort((a, b) => {
    return (b.a || 0) - (a.a || 0)
  }).map(bundle => bundle.h)
}

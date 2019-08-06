import model from './model.js'
import { h } from '//unpkg.com/horseless/dist/horseless.esm.js'
import { ongrade, getScore } from './controller.js'

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

export function mayBeSelected (el) {
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

function _calculateClass (title) {
  const classes = ['card']
  if (title === model.testing) {
    classes.push('testing')
  }
  const score = getScore(title)
  if (score > 1) {
    classes.push('probably')
  } else if (score >= 0) {
    classes.push('maybe')
  } else {
    classes.push('unknown')
  }
  return classes.join(' ')
}

export function sortedCards () {
  return h`<main>
  ${() => Object.keys(model.cards || {}).map(title => {
    const card = model.cards[title]
    const courseConfig = model.catalog[model.course]
    const score = getScore(title)
    const el = memoizeCard(card, card => h`<${courseConfig.component} 
      title=${title} 
      card=${card} 
      ongrade=${ongrade.bind(null, model.course, title)} 
      onclick=${() => { model.testing = title }}
      class=${_calculateClass.bind(null, title)}
    />`)
    return { score, el }
  }).sort((a, b) => {
    return b.score - a.score
  }).map(bundle => bundle.el)}
  </main>`
}

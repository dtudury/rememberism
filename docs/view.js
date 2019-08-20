import model from './model.js'
import { h, watch } from '//unpkg.com/horseless/dist/horseless.esm.js'
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

function _calculateCardClasses (title) {
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

export function cardsHeight () {
  return `height: calc(72px * ${sortedTitles().length - 1} + 5px + 100%);`
}

watch(model, () => {
  const index = sortedTitles().indexOf(model.testing)
  document.querySelector('main.app').scrollTo({ top: index * 72 + 5, left: 0, behavior: 'smooth' })
}, 'testing')

function sortedTitles () {
  return Object.keys(model.cards || {}).reverse().map(title => {
    return { score: getScore(title), title }
  }).sort((a, b) => {
    return a.score - b.score
  }).map(bundle => bundle.title)
}

export function sortedCards () {
  return h`<main>
  ${() => {
    const titles = sortedTitles()
    console.log(titles)
    return titles.map(title => {
      const card = model.cards[title]
      const courseConfig = model.catalog[model.course]
      return memoizeCard(card, card => h`<${courseConfig.component} 
        title=${title} 
        data=${card.data} 
        ongrade=${ongrade.bind(null, model.course, title)} 
        onclick=${() => { model.testing = title }}
        class=${_calculateCardClasses.bind(null, title)}
      />`)
    })
  }}
  </main>`
}

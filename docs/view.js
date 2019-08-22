import model from './model.js'
import { h, watch } from 'https://unpkg.com/horseless/dist/horseless.esm.js'
import { ongrade, getScore, decodeHash } from './controller.js'

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

export function mayBeSelected (href) {
  return () => {
    const { catalogPath, courseName } = decodeHash(href)
    return (model.catalogPath === catalogPath && model.courseName === courseName) ? 'selected' : ''
  }
}

export function cardsOrCourses (cards, courses) {
  return () => {
    if (model.courseName) {
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
  const catalog = model.catalogs[model.catalogPath]
  if (catalog && catalog.courses) {
    const course = catalog.courses[model.courseName]
    return Object.keys(course.cards || {}).reverse().map(title => {
      return { score: getScore(title), title }
    }).sort((a, b) => {
      return a.score - b.score
    }).map(bundle => bundle.title)
  }
  return []
}

const _installMap = new Map()
async function _installComponent (component) {
  if (!_installMap.has(component)) {
    console.log(component.path)
    _installMap.set(component, import(component.path))
  }
  return _installMap.get(component)
}

export function sortedCards () {
  return h`<main>
  ${() => {
    const titles = sortedTitles()
    return titles.map(title => {
      const catalog = model.catalogs[model.catalogPath]
      const course = catalog.courses[model.courseName]
      const card = course.cards[title]
      const component = card.data.component || course.component || catalog.cardComponent
      _installComponent(component)
      return memoizeCard(card, card => h`<${component.name}
      title=${title} 
      data=${card.data} 
      ongrade=${ongrade.bind(null, model.catalogPath, model.courseName, title)} 
      onclick=${() => { model.testing = title }}
      class=${_calculateCardClasses.bind(null, title)}
    />`)
    })
  }}
  </main>`
}

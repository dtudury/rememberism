/* global customElements */

import model, { sortedTitles, getScore } from './model.js'
import { h } from 'https://unpkg.com/horseless/dist/horseless.esm.js'
import { ongrade } from './controller.js'

function _memoize (map, v, f) {
  if (!map.has(v)) {
    map.set(v, f(v))
  }
  return map.get(v)
}
const _cardMap = new Map()
const _memoizeCard = (v, f) => _memoize(_cardMap, v, f)

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

const _installMap = new Map()
async function _installComponent (component) {
  if (!_installMap.has(component)) {
    _installMap.set(component, import(component.path).then(module => { 
      customElements.define(component.name, module.default)
    }))
  }
  return _installMap.get(component)
}

export function mayBeSelected (catalogPath, courseName) {
  return () => {
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

export function cardsHeight () {
  return `height: calc(72px * ${sortedTitles().length - 1} + 5px + 100%);`
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
      return _memoizeCard(card, card => h`<${component.name}
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

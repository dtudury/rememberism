import { watchFunction, remodel } from 'https://unpkg.com/horseless/dist/horseless.esm.js'

const model = remodel({
  now: Date.now(),
  catalogs: {},
  progress: {
    './catalogs/sight-words.json': {},
    './catalogs/yoga-words.json': {
      courses: {
        'Basic Yoga Sanskrit': {
          cards: {
            Yoga: {},
            Namaste: {},
            Asana: {}
          }
        }
      }
    }
  },
  catalogPath: false,
  courseName: false
})

const savedProgress = window.localStorage.getItem('progress')
if (savedProgress) {
  model.progress = JSON.parse(savedProgress)
}

watchFunction(() => {
  window.localStorage.setItem('progress', JSON.stringify(model.progress, null, '  '))
})

export function getReferences () {
  const references = {}
  references.catalog = model.catalogPath && model.catalogs[model.catalogPath]
  references.course = model.courseName && references.catalog && references.catalog.courses[model.courseName]
  references.card = model.testing && references.course && references.course.cards[model.testing]
  return references
}

export function getScore (title) {
  const catalog = model.progress[model.catalogPath]
  const course = catalog && catalog.courses && catalog.courses[model.courseName]
  const progress = course && course.cards && course.cards[title]
  if (progress) {
    if (!progress.due || !progress.start) {
      return 0
    } else {
      return (progress.due - progress.start) / (model.now - progress.start)
    }
  }
  return -1
}

export function sortedTitles () {
  const catalog = model.catalogs[model.catalogPath]
  if (catalog && catalog.courses && model.courseName) {
    const course = catalog.courses[model.courseName]
    const bundles = Object.keys(course.cards || {}).reverse().map(title => {
      return { score: getScore(title), title }
    }).sort((a, b) => {
      return a.score - b.score
    })
    // console.log(JSON.stringify(bundles, null, '  '))
    return bundles.map(bundle => bundle.title)
  }
  return []
}

window.model = model

export default model

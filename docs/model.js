import { watch, remodel } from 'https://unpkg.com/horseless/dist/horseless.esm.js'
const model = remodel({ catalogs: {}, now: Date.now() })

const savedProgress = window.localStorage.getItem('progress')
if (savedProgress) {
  model.progress = JSON.parse(savedProgress)
} else {
  model.progress = {
    './catalogs/sight-words.json': {
    },
    './catalogs/yoga-words.json': {
      'Basic Yoga Sanskrit': {
        Yoga: {},
        Namaste: {},
        Asana: {}
      }
    }
  }
}

watch(model.progress, () => {
  console.log(JSON.stringify(model.progress, null, '  '))
  window.localStorage.setItem('progress', JSON.stringify(model.progress, null, '  '))
})

window.model = model

export default model

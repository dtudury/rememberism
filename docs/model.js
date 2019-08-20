import { watch, remodel } from '//unpkg.com/horseless/dist/horseless.esm.js'
const model = remodel({})
model.now = Date.now()

const savedProgress = window.localStorage.getItem('progress')
if (savedProgress) {
  model.progress = JSON.parse(savedProgress)
} else {
  model.progress = {
    'Pre-K Sight Words': {
      'Pre-primer word 15': {},
      'Pre-primer word 31': {},
      'Pre-primer word 32': {},
      'Pre-primer word 40': {}
    }
  }
}

watch(model.progress, () => {
  console.log(JSON.stringify(model.progress, null, '  '))
  window.localStorage.setItem('progress', JSON.stringify(model.progress, null, '  '))
})

window.model = model

export default model

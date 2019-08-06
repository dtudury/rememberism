import { watch, modelify } from '//unpkg.com/horseless/dist/horseless.esm.js'
const model = modelify({})
model.now = Date.now()

const savedProgress = window.localStorage.getItem('progress')
if (savedProgress) {
  model.progress = JSON.parse(savedProgress)
} else {
  model.progress = {
    'Pre-K Sight Words': {
      'Pre-primer word 1': {},
      'Pre-primer word 2': {},
      'Pre-primer word 3': {}
    }
  }
}

watch(model.progress, () => {
  console.log(JSON.stringify(model.progress, null, '  '))
  window.localStorage.setItem('progress', JSON.stringify(model.progress, null, '  '))
})

export default model

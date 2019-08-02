import { modelify } from '//unpkg.com/horseless/dist/horseless.esm.js'
const model = modelify({})
model.now = Date.now()

/*
setInterval(() => {
  model.now = Date.now()
  // console.log(model.now)
}, 1000)
*/

model.progress = {
  'Pre-K Sight Words': {
    'Pre-primer word 1': {},
    'Pre-primer word 2': {},
    'Pre-primer word 3': {}
  }
}
export default model

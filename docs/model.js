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
    'Pre-primer word 1': { streak: [], c: Date.now() + 1000, b: 1.5 },
    'Pre-primer word 2': { streak: [], c: Date.now() + 1000, b: 1.2 },
    'Pre-primer word 3': { streak: [], c: Date.now() + 100, b: 1.1 }
  }
}
export default model

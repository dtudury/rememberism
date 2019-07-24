/* global fetch */
import model from './model.js'
import { ENROLLED, UNENROLLED, ALL } from './constants.js'

export function beginCourse (course) {
  return e => {
    console.log(course)
    document.location = `${model.catagory}/${encodeURIComponent(course.header)}`
  }
}

export function memoize (map, v, f) {
  if (!map.has(v)) {
    map.set(v, f(v))
  }
  return map.get(v)
}
const courseMap = new Map()
export const memoizeCourse = (v, f) => memoize(courseMap, v, f)

async function init () {
  const config = await (await fetch('./catalog.json')).json()
  model.catalog = config.catalog
}
init()

const readHash = () => {
  const slashIndex = document.location.hash.indexOf('/')
  let preSlash = document.location.hash
  let postSlash
  if (slashIndex !== -1) {
    preSlash = document.location.hash.substring(0, slashIndex)
    postSlash = document.location.hash.substring(slashIndex + 1)
  }
  if (preSlash === UNENROLLED) {
    model.catagory = UNENROLLED
  } else if (preSlash === ALL) {
    model.catagory = ALL
  } else {
    model.catagory = ENROLLED
  }
  if (postSlash) {
    model.course = decodeURIComponent(document.location.hash.substring(slashIndex + 1))
  } else {
    model.course = null
  }
  console.log(model.catagory, model.course)
}
window.addEventListener('load', readHash)
window.addEventListener('hashchange', readHash)

import model from './model.js'

export function memoize (map, v, f) {
  if (!map.has(v)) {
    map.set(v, f(v))
  }
  return map.get(v)
}
const courseMap = new Map()
export const memoizeCourse = (v, f) => memoize(courseMap, v, f)
const cardMap = new Map()
export const memoizeCard = (v, f) => memoize(cardMap, v, f)

export function maybeSelected (el) {
  return (model.catagory === el.hash) ? 'selected' : ''
}

export function cardsOrCourses (course, courses) {
  return () => {
    if (model.course) {
      return course
    } else {
      return courses
    }
  }
}

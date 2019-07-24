import model from './model.js'

export function memoize (map, v, f) {
  if (!map.has(v)) {
    map.set(v, f(v))
  }
  return map.get(v)
}
const courseMap = new Map()
export const memoizeCourse = (v, f) => memoize(courseMap, v, f)

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

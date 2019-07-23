import model from './model.js'

export function maybeSelected (el) {
  return (model.hash === el.hash) ? 'selected' : ''
}

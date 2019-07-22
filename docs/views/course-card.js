/* global customElements HTMLElement */

class CourseCard extends HTMLElement {
  constructor () {
    super()
    console.log('constructor', this.course)
  }
  connectedCallback () {
    console.log('connected', this.course)
  }
  disconnectedCallback () {
  }
}

customElements.define('course-card', CourseCard)

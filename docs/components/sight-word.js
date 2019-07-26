/* global customElements HTMLElement */
import { h, watchSetChildren, unwatchFunction } from '//unpkg.com/horseless/dist/horseless.esm.js'

customElements.define('sight-word', class extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }
  connectedCallback () {
    console.log('connected', this.card)
    this.showCard()
  }
  disconnectedCallback () {
    unwatchFunction(this.watchedFunction)
    delete this.watchedFunction
  }
  showCard () {
    if (this.card && !this.watchedFunction) {
      this.watchedFunction = watchSetChildren(this.shadowRoot, h`
        <style>
          :host {
            background-color: white;
            padding: 16px;
          }
        </style>
        <span>${this.title}</span>
        <span>${this.card}</span>
      `)
    }
  }
})

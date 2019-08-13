/* global customElements HTMLElement */
import { h, render, unwatchFunction } from '//unpkg.com/horseless/dist/horseless.esm.js'

customElements.define('sight-word', class extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.showCard()
  }

  disconnectedCallback () {
    unwatchFunction(this._watchedFunction)
    delete this._watchedFunction
  }

  showCard () {
    if (this.card && !this._watchedFunction) {
      this._watchedFunction = render(this.shadowRoot, h`
        <style>
          :host {
            background-color: white;
            padding: 16px;
          }
          h1 {
            font-weight: normal;
            font-size: 20px;
            margin: 0;
            margin-bottom: 4px;
          }
        </style>
        <h1>${this.title}</h1>
        <h2>${this.card}</h2>
        <span onclick=${e => this.ongrade(true, e)}>correct</span>
        <span onclick=${e => this.ongrade(false, e)}>incorrect</span>
      `)
    }
  }
})

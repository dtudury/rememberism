/* global customElements HTMLElement */
import { h, watchSetChildren, unwatchFunction } from '//unpkg.com/horseless/dist/horseless.esm.js'

customElements.define('sight-word', class extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
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
          h1 {
            font-weight: normal;
            font-size: 20px;
            margin: 0;
            margin-bottom: 4px;
          }
        </style>
        <h1>${this.title}</h1>
        <span onclick=${this.handleclick}>${() => JSON.stringify(this.progress)}</span>
      `)
    }
  }

  handleClick () {
    console.log('click')
  }
})

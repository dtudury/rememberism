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
    if (this.data && !this._watchedFunction) {
      this._watchedFunction = render(this.shadowRoot, h`
        <style>
          :host {
            background-color: white;
            grid-template-rows: 56px 1fr auto;
          }
          h1 {
            font-weight: normal;
            font-size: 20px;
            margin: auto 16px;
          }
          h2 {
            font-size: 64px;
            padding: 32px 16px;
            margin: 0;
          }
          hr {
            border: none;
            border-top: solid 1px lightgray;
            margin: 0 16px;
          }
          .actionarea {
            margin: 8px 12px;
          }
          button {
            float: left;
            margin: 0 4px;
            background: none;
            padding: 12px;
            font-size: 14px;
            border-radius: 4px;
            cursor: pointer;
          }
          .correct {
            color: darkgreen;
            border: solid 1px darkgreen;
          }
          .incorrect {
            color: firebrick;
            border: solid 1px firebrick;
          }
        </style>
        <h1>${this.title}</h1>
        <hr/>
        <h2>${this.data}</h2>
        <hr/>
        <div class="actionarea">
          <button class="correct" onclick=${e => this.ongrade(true, e)}>👍 CORRECT</button>
          <button class="incorrect" onclick=${e => this.ongrade(false, e)}>👎 INCORRECT</button>
        </div>
      `)
    }
  }
})

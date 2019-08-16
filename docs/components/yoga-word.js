/* global customElements HTMLElement */
import { h, render, unwatchFunction } from '//unpkg.com/horseless/dist/horseless.esm.js'

customElements.define('yoga-word', class extends HTMLElement {
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
            grid-template-rows: 28px 1fr auto;
            padding: 16px;
          }
          h1 {
            font-weight: normal;
            font-size: 20px;
            margin: 0;
          }
          span {
            display: none;
            font-size: 14px;
            color: darkgray;
          }
          :host(.testing) span {
            display: unset;
          }
          h2 {
            font-size: 24px;
            padding: 32px 0;
            margin: 16px 0;
            border-top: solid 1px lightgray;
            border-bottom: solid 1px lightgray;
            overflow: hidden;
          }
          .reveal {
            cursor: pointer;
            outline: none;
          }
          :not(.shown).reveal::after {
            content: "∨";
            float: right;
            transform: scaleX(1.6);
          }
          .shown.reveal::after {
            content: "∧";
            float: right;
            transform: scaleX(1.6);
          }
          .answer {
            display: none;
          }
          .answer.shown {
            display: unset;
          }
          button {
            float: left;
            margin: 0 8px 0 0;
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
        <span class="reveal" tabindex="0" onclick=${e => this.toggleReveal()} onblur=${e => this.unReveal(e)}>translation</span>
        <div class="answer">
          <h2>${this.card}</h2>
          <div class="actionarea">
            <button class="correct" onclick=${e => this.ongrade(true, e)}>👍 CORRECT</button>
            <button class="incorrect" onclick=${e => this.ongrade(false, e)}>👎 INCORRECT</button>
          </div>
        </div>
      `)
    }
  }

  toggleReveal () {
    this.shadowRoot.querySelector('.answer').classList.toggle('shown')
    this.shadowRoot.querySelector('.reveal').classList.toggle('shown')
  }

  unReveal (e) {
    console.log(this.title)
    setTimeout(() => {
      this.shadowRoot.querySelector('.answer').classList.remove('shown')
      this.shadowRoot.querySelector('.reveal').classList.remove('shown')
    }, 100) // gross
  }
})

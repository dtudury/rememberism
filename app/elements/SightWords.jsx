
/* global HTMLElement SpeechSynthesisUtterance */

import h from 'horsy' // eslint-disable-line no-unused-vars
import words from '../words.json'

export default class CustomizedTest extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }
  connectedCallback () {
    let children = []
    setInterval(() => {
      this.style.cssText = `
        height: 100px;
        overflow: auto;
        display: flex;
        flex-direction: column-reverse;
      `
      let word = words[Math.floor(Math.random() * words.length)]
      let utterance = new SpeechSynthesisUtterance(word)
      window.speechSynthesis.speak(utterance)
      let div = <div>{word}</div>
      children.unshift(div)
      while (children.length > 10) {
        children.pop()
      }
      h.setChildren(this.shadow, children)
    }, 1000)
  }
  static get NAME () {
    return 'sight-words-element'
  }
}

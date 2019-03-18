
/* global HTMLElement SpeechSynthesisUtterance */

import words from '../words.json'
import horsy from 'horsy'
import { setChildren } from 'horsy/lib/nodeCreators'

export default class CustomizedTest extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }
  connectedCallback () {
    console.log(Object.keys(window))
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
      let div = horsy`<div>${word}</div>`
      children.unshift(div)
      while (children.length > 10) {
        children.pop()
      }
      setChildren(this.shadow, children)
    }, 1000)
  }
  static get NAME () {
    return 'sight-words-element'
  }
}

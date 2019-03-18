/* global customElements */
import horsy from 'horsy'
import { setChildren } from 'horsy/lib/nodeCreators'
import SightWords from './elements/SightWords'

customElements.define('sight-words', SightWords)

setChildren(document.body, horsy`<sight-words/>`)

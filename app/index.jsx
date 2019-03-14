import h from 'horsy' // eslint-disable-line no-unused-vars
import SightWords from './elements/SightWords'

const SightWordsTag = h.customElementToTag(SightWords)

document.body.appendChild(<SightWordsTag />)

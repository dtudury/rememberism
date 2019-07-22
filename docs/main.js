/* global fetch */
import { h, watchSetChildren } from '//unpkg.com/horseless/dist/horseless.esm.js'
import model from './model.js'
import './views/course-card.js'

navigator.serviceWorker.register('/sw.js').then(reg => {
  console.log('Service worker registered.', reg)
})

async function init () {
  const config = await (await fetch('./catalog.json')).json()
  console.log(config)
  model.catalog = config.catalog
  /*
  setInterval(() => {
    model.catalog['Kindergarten Sight Words'].header = '' + Math.random()
  }, 500)
  */
}
init()

const catalogMap = new Map()
export function memoize (map, value, f) {
  if (!map.has(value)) {
    map.set(value, f(value))
  }
  return map.get(value)
}

watchSetChildren(document.body, h`
<header>
  <nav>
    <a href="#">back</a>
  </nav>
  <h1>
    Sight Words
  </h1>
</header>

<section>
  ${() => Object.keys(model.catalog || {}).map(header => memoize(catalogMap, model.catalog[header], course => h`<article class="course">
    <header>
      <h1>${() => course.header}</h1>
      <h2>${() => course.subhead}</h2>
    </header>
    <section class="supporting">${() => course.supporting}</section>
  </article>`))}

  <article class="flashcard">
    <header>
      <h1>
        Title goes here
      </h1>
      <h2>
        Secondary text
      </h2>
    </header>
    <section class="question">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </section>
    <section class="answer">
      Dolor sed viverra ipsum nunc aliquet bibendum enim.
    </section>
  </article>

  <aside>
    <p>
      Author info
    </p>
  </aside>
</section>

<footer>
  Copyright Info
</footer>
`)

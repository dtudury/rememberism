import { h, render } from 'https://unpkg.com/horseless/dist/horseless.esm.js'
import model from './model.js'
import { cardsOrCourses, mayBeSelected, memoizeCourse, sortedCards, cardsHeight } from './view.js'
import { encodeHash } from './controller.js'

navigator.serviceWorker.register('/sw.js')

function courseListElements (catalog, catalogPath) {
  return Object.keys(catalog.courses || {}).map(courseName => {
    const href = encodeHash(catalogPath, courseName)
    return h`<li><a class=${mayBeSelected(href)} href=${href}>${courseName}</a></li>`
  })
}

render(document.body, h`
<header class="app">
  <svg class="hamburger" focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
  </svg>
  <img class="logo" src="/site-config/apple-touch-icon.png" />
  <h1>
    Rememberism
  </h1>
</header>

<nav class="app">
  <ul>
    <li><a href="#enrolled">enrolled</a>
      <ul>
${() => Object.keys(model.progress).map(catalogPath => {
  return courseListElements(model.progress[catalogPath], catalogPath)
})}
      </ul>
    </li>
${() => Object.keys(model.catalogs).map(catalogPath => {
  const catalog = model.catalogs[catalogPath]
  const href = encodeHash(catalogPath)
  return h`
    <li><a class=${mayBeSelected(href)} href=${href}>${() => catalog.name}</a>
      <ul>${() => courseListElements(catalog, catalogPath)}</ul>
    </li>`
})}
  </ul>
</nav>

<main class="app">
${cardsOrCourses(h`
  <section class="cards" style=${cardsHeight}>
    ${sortedCards}
  </section>
`, h`
  <section class="courses">
${() => {
  return []
}}
  </section>
`)}
</main>

<footer class="app">
  Copyright Info
</footer>
`)

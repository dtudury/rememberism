import { h, render, watchFunction } from 'https://unpkg.com/horseless/dist/horseless.esm.js'
import model, { sortedTitles } from './model.js'
import { cardsOrCourses, mayBeSelected, sortedCards, cardsHeight } from './view.js'
import { setCourse } from './controller.js'

navigator.serviceWorker.register('/sw.js')

function courseListElements (catalog, catalogPath) {
  return Object.keys(catalog.courses || {}).map(courseName => {
    return h`<li><a class=${mayBeSelected(catalogPath, courseName)} onclick=${() => setCourse(catalogPath, courseName)}>${courseName}</a></li>`
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
  return h`
    <li><a class=${mayBeSelected(catalogPath, false)} onclick=${() => setCourse(catalogPath, false)}>${() => catalog.name}</a>
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

watchFunction(() => {
  const index = sortedTitles().indexOf(model.testing)
  document.querySelector('main.app').scrollTo({ top: index * 72 + 5, left: 0, behavior: 'smooth' })
})

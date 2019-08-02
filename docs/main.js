import { h, watchSetChildren } from '//unpkg.com/horseless/dist/horseless.esm.js'
import { ENROLLED, UNENROLLED, ALL } from './constants.js'
import model from './model.js'
import { cardsOrCourses, maybeSelected, memoizeCourse, sortedCards } from './view.js'
import { beginCourse, leaveCourse } from './controller.js'

navigator.serviceWorker.register('/sw.js')

watchSetChildren(document.body, h`
<header class="app">
  <h1>
    <svg focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
    </svg>
    <img src="/site-config/favicon-32x32.png" />
    Rememberism
  </h1>
</header>

<nav class="app">
  <a class=${maybeSelected} href=${ENROLLED}>enrolled</a>
  <a class=${maybeSelected} href=${UNENROLLED}>unenrolled</a>
  <a class=${maybeSelected} href=${ALL}>all courses</a>
</nav>

<main class="app">
${cardsOrCourses(h`
  <section class="cards">
    <header>
      <button onclick=${leaveCourse}>
      <svg focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12L12 4L13 5L8 11H19V13H8L13 19L12 20L4 12z"></path>
      </svg>
      </button>
      ${() => model.course}
    </header>
    <main>
      ${sortedCards}
    </main>
  </section>
`, h`
  <section class="courses">
  ${() => Object.keys(model.catalog || {}).map(header => memoizeCourse(model.catalog[header], course => h`
    <article class="course">
      <header>
        <h1>${() => header}</h1>
        <h2>${() => course.subhead}</h2>
      </header>
      <section class="supporting">${() => course.supporting}</section>
      <nav>
        <button onclick=${beginCourse(header)}>BEGIN</button>
      </nav>
    </article>
  `))}
  </section>
`)}
</main>

<footer class="app">
  Copyright Info
</footer>
`)

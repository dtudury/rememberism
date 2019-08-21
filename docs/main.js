import { h, render } from 'https://unpkg.com/horseless/dist/horseless.esm.js'
import { ENROLLED, UNENROLLED, ALL } from './constants.js'
import model from './model.js'
import { cardsOrCourses, mayBeSelected, memoizeCourse, sortedCards, cardsHeight } from './view.js'
import { setCourse } from './controller.js'

navigator.serviceWorker.register('/sw.js')

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
    <li><a class=${mayBeSelected} href=${ENROLLED}>enrolled</a></li>
    <li><a class=${mayBeSelected} href=${UNENROLLED}>unenrolled</a></li>
    <li><a class=${mayBeSelected} href=${ALL}>all courses</a></li>
${() => {
  console.log(model.catalogs)
  Object.keys(model.catalogs).map(catalogPath => {
    const catalog = model.catalogs[catalogPath]
    console.log(catalogPath)
    Object.keys(catalog.courses).map(courseName => {
      console.log(courseName)
    })
  })
  return h`<span>what</span>`
}}
  </ul>
</nav>

<main class="app">
${cardsOrCourses(h`
  <section class="cards" style=${cardsHeight}>
    <header>
      <span class="backbutton" onclick=${() => { setCourse() }}>⬅</span>
      ${() => model.course}
    </header>
    ${sortedCards}
  </section>
`, h`
  <section class="courses">
${() => {
  let courseTitles = Object.keys(model.catalog || {})
  const enrolledTitles = Object.keys(model.progress || {})
  if (model.catagory === ENROLLED) {
    courseTitles = courseTitles.filter(courseTitle => enrolledTitles.indexOf(courseTitle) !== -1)
  } else if (model.catagory === UNENROLLED) {
    courseTitles = courseTitles.filter(courseTitle => enrolledTitles.indexOf(courseTitle) === -1)
  }
  return courseTitles.map(courseTitle => memoizeCourse(model.catalog[courseTitle], course => h`
    <article class="course">
      <header>
        <h1>${() => courseTitle}</h1>
        <h2>${() => course.subhead}</h2>
      </header>
      <section class="supporting">${() => course.supporting}</section>
      <nav>
        <button onclick=${() => { setCourse(model.catagory, courseTitle) }}>▶ BEGIN</button>
      </nav>
    </article>
  `))
}}
  </section>
`)}
</main>

<footer class="app">
  Copyright Info
</footer>
`)

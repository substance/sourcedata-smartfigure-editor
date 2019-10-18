import { SmartFigurePage } from './smart-figure.js'

window.addEventListener('load', () => {
  window.app = SmartFigurePage.mount({}, window.document.body, { inplace: true })
})

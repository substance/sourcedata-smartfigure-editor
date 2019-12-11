import { SmartFigurePage } from './smartfigure-editor.js'

window.addEventListener('load', () => {
  window.app = SmartFigurePage.mount({}, window.document.body, { inplace: true })
})

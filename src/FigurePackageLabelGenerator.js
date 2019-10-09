import { LATIN_LETTERS_UPPER_CASE, FigureLabelGenerator } from 'substance-texture'

export default class FigurePackageLabelGenerator extends FigureLabelGenerator {
  constructor () {
    super({
      singular: '$',
      plural: '$',
      and: ',',
      to: '-'
    })
  }

  _getSingleCounter (def) {
    if (def.length === 1) {
      return String(def[0].pos)
    } else {
      return `${this._getPanelLabel(def)}`
    }
  }

  _getPanelLabel (def) {
    const panelCounter = def[1].pos
    return `${LATIN_LETTERS_UPPER_CASE[panelCounter - 1]}`
  }
}

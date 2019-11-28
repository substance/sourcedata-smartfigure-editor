import BasicItemCommand from './_BasicItemCommand'

export default class BasicFigurePanelCommand extends BasicItemCommand {
  getType () {
    return 'panel'
  }
}

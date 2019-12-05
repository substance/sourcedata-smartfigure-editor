import BasicItemCommand from './_BasicItemCommand'

export default class BasicPanelCommand extends BasicItemCommand {
  getType () {
    return 'panel'
  }
}

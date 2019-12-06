import RemoveValueCommand from './RemoveValueCommand'

export default class RemoveAttachedResourceCommand extends RemoveValueCommand {
  getPropertySelector () {
    return 'panel.resources'
  }
}

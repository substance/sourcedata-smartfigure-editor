import MoveValueCommand from './MoveValueCommand'

export default class MoveAttachedResourceCommand extends MoveValueCommand {
  getPropertySelector () {
    return 'panel.resources'
  }
}

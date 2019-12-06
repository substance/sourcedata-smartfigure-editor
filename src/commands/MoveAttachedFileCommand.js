import MoveValueCommand from './MoveValueCommand'

export default class MoveAttachedFileCommand extends MoveValueCommand {
  getPropertySelector () {
    return 'panel.files'
  }
}

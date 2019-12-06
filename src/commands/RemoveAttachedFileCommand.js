import RemoveValueCommand from './RemoveValueCommand'

export default class RemoveAttachedFileCommand extends RemoveValueCommand {
  getPropertySelector () {
    return 'panel.files'
  }
}

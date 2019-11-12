import { MoveItemCommand } from 'substance'

export default class MoveFileCommand extends MoveItemCommand {
  getType () {
    return 'file'
  }
}

import { RemoveItemCommand } from 'substance'

export default class RemoveFileCommand extends RemoveItemCommand {
  getType () {
    return 'file'
  }
}

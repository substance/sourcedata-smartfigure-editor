import { RemoveItemCommand } from 'substance'

export default class RemoveResourceCommand extends RemoveItemCommand {
  getType () {
    return 'resource'
  }
}

import { MoveItemCommand } from 'substance'

export default class MoveResourceCommand extends MoveItemCommand {
  getType () {
    return 'resource'
  }
}

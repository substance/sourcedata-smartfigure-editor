import { MoveItemCommand } from 'substance'

export default class MoveKeywordGroupCommand extends MoveItemCommand {
  getType () {
    return 'keyword-group'
  }
}

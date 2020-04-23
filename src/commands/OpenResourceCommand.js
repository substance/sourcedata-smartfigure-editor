import { ItemCommand } from 'substance'

export default class OpenResourceCommand extends ItemCommand {
  getType () {
    return 'resource'
  }

  execute (params, context) {
    const { node } = params.commandState
    context.app.send('openLink', node.href)
  }
}

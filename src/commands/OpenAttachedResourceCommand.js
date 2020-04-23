import { ValueCommand } from 'substance'

export default class OpenAttachedResourceCommand extends ValueCommand {
  getPropertySelector () {
    return 'panel.resources'
  }

  execute (params, context) {
    const { editorSession } = params
    const { valueId } = params.commandState
    const doc = editorSession.getDocument()
    const node = doc.get(valueId)
    if (node) {
      context.app.send('openLink', node.href)
    }
  }
}

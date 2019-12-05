import BasicPanelCommand from './_BasicPanelCommand'

export default class RemovePanelCommand extends BasicPanelCommand {
  execute (params, context) {
    const { currentItemId } = params.commandState
    const editor = context.editorSession.getRootComponent()
    if (editor) {
      context.api.removeAndDeleteNode(currentItemId)
    }
  }
}

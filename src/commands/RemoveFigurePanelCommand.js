import BasicFigurePanelCommand from './_BasicFigurePanelCommand'

export default class RemoveFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const editor = context.editor
    const commandState = params.commandState
    if (editor) {
      context.api.removePanel(commandState.currentPanelId)
    }
  }
}

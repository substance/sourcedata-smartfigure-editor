import BasicFigurePanelCommand from './_BasicFigurePanelCommand'

export class ReplaceFigurePanelImageCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const editor = context.editor
    const commandState = params.commandState
    if (editor) {
      editor.send('requestFileSelect', { fileType: 'image/*', multiple: false }).then(files => {
        if (files.length > 0) {
          context.api.replacePanelImage(commandState.currentPanelId, files[0])
        }
      })
    }
  }
}

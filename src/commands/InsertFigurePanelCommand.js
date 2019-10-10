import BasicFigurePanelCommand from './_BasicFigurePanelCommand'

export default class InsertFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const editor = context.editor
    const commandState = params.commandState
    if (editor) {
      editor.send('requestFileSelect', { fileType: 'image/*', multiple: false }).then(files => {
        if (files.length > 0) {
          context.api.insertPanelAfter(commandState.currentPanelId, files[0])
        }
      })
    }
  }
}

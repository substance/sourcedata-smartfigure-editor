import BasicFigurePanelCommand from './_BasicFigurePanelCommand'

export default class InsertFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const commandState = params.commandState
    const editor = context.editorSession.getRootComponent()
    if (editor) {
      editor.send('requestFileSelect', { fileType: 'image/*', multiple: false }).then(files => {
        if (files.length > 0) {
          context.api.insertPanelAfter(commandState.currentItemId, files[0])
        }
      })
    }
  }
}

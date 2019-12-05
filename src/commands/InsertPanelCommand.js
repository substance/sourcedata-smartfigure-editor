import BasicPanelCommand from './_BasicPanelCommand'

export default class InsertPanelCommand extends BasicPanelCommand {
  execute (params, context) {
    const commandState = params.commandState
    const editor = context.editorSession.getRootComponent()
    if (editor) {
      editor.send('requestFileSelect', { fileType: 'image/*', multiple: false }).then(files => {
        if (files.length > 0) {
          context.api.insertPanel(files[0], commandState.currentItemId)
        }
      })
    }
  }
}

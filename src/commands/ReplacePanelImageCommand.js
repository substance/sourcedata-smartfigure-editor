import BasicPanelCommand from './_BasicPanelCommand'

export default class ReplacePanelImageCommand extends BasicPanelCommand {
  execute (params, context) {
    const commandState = params.commandState
    const editor = context.editorSession.getRootComponent()
    if (editor) {
      editor.send('requestFileSelect', { fileType: 'image/*', multiple: false }).then(files => {
        if (files.length > 0) {
          context.api.replacePanelImage(commandState.currentItemId, files[0])
        }
      })
    }
  }
}
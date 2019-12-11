import { ItemCommand } from 'substance'

export default class ReplacePanelImageCommand extends ItemCommand {
  getType () {
    return 'panel'
  }

  execute (params, context) {
    const commandState = params.commandState
    const editor = context.editorSession.getRootComponent()
    if (editor) {
      editor.send('requestFileSelect', { fileType: 'image/*', multiple: false }).then(files => {
        if (files.length > 0) {
          context.api.replacePanelImage(commandState.node.id, files[0])
        }
      })
    }
  }
}

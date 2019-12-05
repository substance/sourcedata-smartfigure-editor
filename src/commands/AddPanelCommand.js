import { Command } from 'substance'

export default class AddPanelCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }

  execute (params, context) {
    const editor = context.editorSession.getRootComponent()
    if (editor) {
      editor.send('requestFileSelect', { fileType: 'image/*', multiple: false }).then(files => {
        if (files.length > 0) {
          context.api.addPanel(files[0])
        }
      })
    }
  }
}

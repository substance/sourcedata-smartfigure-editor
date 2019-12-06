import { Command, $$ } from 'substance'
import FileModal from '../components/FileModal'

export default class AddFileCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }

  execute (params, context) {
    const editorSession = context.editorSession
    const api = context.api
    const editor = editorSession.getRootComponent()
    editor.send('requestFileSelect', { multiple: false }).then(files => {
      if (files.length > 0) {
        const file = files[0]
        return editorSession.getRootComponent().send('requestModal', () => {
          return $$(FileModal, { file })
        }).then(modal => {
          if (!modal) return
          const { src } = modal.state.data
          return api.addFile(src, file)
        })
      }
    })
  }
}

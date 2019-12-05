import { $$, ItemCommand } from 'substance'
import FileModal from '../components/FileModal'

export default class EditFileCommand extends ItemCommand {
  execute (params, context) {
    const { node } = params.commandState
    const editorSession = context.editorSession
    const api = context.api
    return editorSession.getRootComponent().send('requestModal', () => {
      return $$(FileModal, {
        mode: 'edit',
        node
      })
    }).then(modal => {
      if (!modal) return
      const data = modal.state.data
      api.updateFile(node.id, data)
    })
  }
}

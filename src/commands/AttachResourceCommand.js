import { $$ } from 'substance'
import BasicItemCommand from './_BasicItemCommand'
import AttachResourceModal from '../components/AttachResourceModal'

export default class AttachResourceCommand extends BasicItemCommand {
  getType () {
    return 'panel'
  }

  execute (params, context) {
    const { currentItemId } = params.commandState
    const editorSession = context.editorSession
    const doc = editorSession.getDocument()
    const panel = doc.get(currentItemId)
    const api = context.api
    return editorSession.getRootComponent().send('requestModal', () => {
      return $$(AttachResourceModal, { node: panel })
    }).then(modal => {
      if (!modal) return
      const selectedId = modal.state.selectedId
      api.attachResource(currentItemId, selectedId)
    })
  }
}

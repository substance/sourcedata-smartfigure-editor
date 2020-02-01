import { Command, $$ } from 'substance'
import ReferenceModal from '../components/ReferenceModal'

export default class AddReferenceCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }

  execute (params, context) {
    const editorSession = context.editorSession
    editorSession.getRootComponent().send('requestModal', () => {
      return $$(ReferenceModal, {})
    }).then(modal => {
      if (!modal) return
      context.api.addReference(modal.state.data)
    })
  }
}

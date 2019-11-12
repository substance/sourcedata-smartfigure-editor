import { Command, $$ } from 'substance'
import ResourceModal from '../components/ResourceModal'

export default class AddResourceCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }

  execute (params, context) {
    const editorSession = context.editorSession
    const api = context.api
    editorSession.getRootComponent().send('requestModal', () => {
      return $$(ResourceModal, {})
    }).then(modal => {
      if (!modal) return
      const url = modal.refs.url.val()
      api.insertResource(url)
    })
  }
}

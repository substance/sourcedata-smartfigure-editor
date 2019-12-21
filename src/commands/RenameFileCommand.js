import { $$, ItemCommand, AssetModal } from 'substance'

export default class RenameFileCommand extends ItemCommand {
  getType () {
    return 'file'
  }

  getCommandState (params, context) {
    const commandState = super.getCommandState(params, context)
    // Note: only activating this command if the file is pointing to an existing asset
    if (!commandState.disabled) {
      const node = commandState.node
      const archive = context.archive
      const asset = archive.getAssetById(node.src)
      commandState.disabled = !asset
      commandState.asset = asset
    }
    return commandState
  }

  execute (params, context) {
    const { node, asset } = params.commandState
    const editorSession = context.editorSession
    const api = context.api
    return editorSession.getRootComponent().send('requestModal', () => {
      return $$(AssetModal, {
        mode: 'edit',
        node: asset
      })
    }).then(modal => {
      if (!modal) return
      const filename = modal.state.data.filename
      api.renameFile(node, filename)
    })
  }
}

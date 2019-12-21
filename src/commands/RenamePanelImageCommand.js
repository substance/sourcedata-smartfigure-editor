import { $$, ItemCommand, AssetModal } from 'substance'

export default class RenamePanelImageCommand extends ItemCommand {
  getType () {
    return 'panel'
  }

  getCommandState (params, context) {
    const commandState = super.getCommandState(params, context)
    // Note: only activating this command if the panel has an (existing) image
    if (!commandState.disabled) {
      let asset
      const archive = context.archive
      const image = commandState.node.resolve('image')
      if (image) {
        asset = archive.getAssetById(image.src)
      }
      commandState.asset = asset
      commandState.disabled = !asset
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
      api.renamePanelImage(node, filename)
    })
  }
}

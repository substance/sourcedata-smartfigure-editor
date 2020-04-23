import { ValueCommand } from 'substance'

export default class DownloadAttachedFileCommand extends ValueCommand {
  getPropertySelector () {
    return 'panel.files'
  }

  execute (params, context) {
    const { editorSession } = params
    const { valueId } = params.commandState
    const { archive } = context
    const attachedFile = editorSession.getDocument().get(valueId)
    if (!attachedFile) {
      console.error('Could not find attached file')
      return
    }
    const asset = archive.getAssetById(attachedFile.src)
    if (!asset) {
      console.error('Could not find asset for attached file', attachedFile.src)
      return
    }
    context.app.send('downloadAsset', asset)
  }
}

import RenamePanelImageCommand from './RenamePanelImageCommand'

export default class DownloadPanelImageCommand extends RenamePanelImageCommand {
  execute (params, context) {
    const { asset } = params.commandState
    context.app.send('downloadAsset', asset)
  }
}

import RenameFileCommand from './RenameFileCommand'

export default class DownloadFileCommand extends RenameFileCommand {
  execute (params, context) {
    const { asset } = params.commandState
    context.app.send('downloadAsset', asset)
  }
}

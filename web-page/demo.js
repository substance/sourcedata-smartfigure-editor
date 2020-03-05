import { getQueryStringParam } from 'substance'
import VfsStorageClient from 'substance/dar/VfsStorageClient'
import loadArchive from 'substance/dar/loadArchive'
import { SmartFigureConfiguration, SmartFigureEditor } from '../index'

window.addEventListener('load', () => {
  const config = new SmartFigureConfiguration()
  // TODO: this should be generalized if we want to use this component in a different
  // embedding scenario
  const archiveId = getQueryStringParam('archiveId') || 'kitchen-sink'
  const vfsStorage = new VfsStorageClient(window.vfs, '/data/')
  const rawArchive = vfsStorage.read(archiveId)
  const archive = loadArchive(rawArchive, config)

  SmartFigureEditor.mount({ archive }, window.document.body, { inplace: true })
})

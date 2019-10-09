import { getQueryStringParam } from 'substance'
import { TextureWebApp } from 'substance-texture'

window.addEventListener('load', () => {
  window.app = TextureWebApp.mount({
    debug: true,
    archiveId: getQueryStringParam('archive') || 'kitchen-sink',
    storageType: getQueryStringParam('storage') || 'vfs',
    storageUrl: getQueryStringParam('storageUrl') || '/archives',
    vfs: window.vfs,
    enableRouting: false
  }, window.document.body)
})

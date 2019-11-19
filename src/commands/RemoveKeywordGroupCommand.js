import BasicKeywordGroupCommand from './_BasicKeywordGroupCommand'

export default class RemoveKeywordGroupCommand extends BasicKeywordGroupCommand {
  execute (params, context) {
    const { currentItemId } = params.commandState
    const editor = context.editorSession.getRootComponent()
    if (editor) {
      context.api.removeAndDeleteNode(currentItemId)
    }
  }
}

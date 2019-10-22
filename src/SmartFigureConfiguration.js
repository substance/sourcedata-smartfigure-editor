import {
  Configurator, DefaultHtmlImporter, HTMLExporter,
  UndoCommand, RedoCommand, SelectAllCommand,
  AnnotationCommand, BasePackage, HtmlConverters,
  ParagraphComponent, HeadingComponent, OpenIsolatedNodeComponent,
  ImageComponent, LinkComponent, CreateLinkCommand
} from 'substance'

import SmartFigureLoader from './model/SmartFigureLoader'
import SmartFigureComponent from './components/SmartFigureComponent'
import InsertFigurePanelCommand from './commands/InsertFigurePanelCommand'
import RemoveFigurePanelCommand from './commands/RemoveFigurePanelCommand'
import ReplaceFigurePanelImageCommand from './commands/ReplaceFigurePanelImageCommand'
import MoveFigurePanelCommand from './commands/MoveFigurePanelCommand'
import AddAuthorCommand from './commands/AddAuthorCommand'

const {
  ParagraphConverter, HeadingConverter, FigureConverter, BoldConverter, ItalicConverter,
  StrikeConverter, SubscriptConverter, SuperscriptConverter
} = HtmlConverters

export default class SmartFigureConfiguration extends Configurator {
  constructor () {
    super()

    this.configure(this)
  }

  configure (config) {
    config.import(BasePackage)
    // using the 'open' version of IsolatedNodeComponent
    config.addComponent('isolated-node', OpenIsolatedNodeComponent, { force: true })

    config.registerDocumentLoader('smart-figure', SmartFigureLoader)

    // document specific configuration
    config.addComponent('smart-figure', SmartFigureComponent)
    config.addComponent('paragraph', ParagraphComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('image', ImageComponent)
    config.addComponent('link', LinkComponent)

    // HTML conversion
    config.addConverter('html', ParagraphConverter)
    config.addConverter('html', HeadingConverter)
    config.addConverter('html', FigureConverter)
    config.addConverter('html', BoldConverter)
    config.addConverter('html', ItalicConverter)
    config.addConverter('html', StrikeConverter)
    config.addConverter('html', SubscriptConverter)
    config.addConverter('html', SuperscriptConverter)
    config.addImporter('html', DefaultHtmlImporter)
    config.addExporter('html', HTMLExporter)

    // Commands
    config.addCommand('undo', UndoCommand, { accelerator: 'CommandOrControl+z' })
    config.addCommand('redo', RedoCommand, { accelerator: 'CommandOrControl+Shift+z' })
    config.addCommand('select-all', SelectAllCommand, { accelerator: 'CommandOrControl+a' })

    config.addCommand('toggle-bold', AnnotationCommand, {
      nodeType: 'bold',
      accelerator: 'CommandOrControl+B'
    })
    config.addCommand('toggle-italic', AnnotationCommand, {
      nodeType: 'italic',
      accelerator: 'CommandOrControl+I'
    })
    config.addCommand('toggle-strike', AnnotationCommand, {
      nodeType: 'strike',
      accelerator: 'CommandOrControl+Shift+X'
    })
    config.addCommand('toggle-subscript', AnnotationCommand, {
      nodeType: 'subscript',
      accelerator: 'CommandOrControl+Shift+B'
    })
    config.addCommand('toggle-superscript', AnnotationCommand, {
      nodeType: 'superscript',
      accelerator: 'CommandOrControl+Shift+P'
    })
    config.addCommand('create-link', CreateLinkCommand, {
      nodeType: 'link',
      accelerator: 'CommandOrControl+K'
    })
    config.addCommand('insert-figure-panel', InsertFigurePanelCommand)
    config.addCommand('remove-figure-panel', RemoveFigurePanelCommand)
    config.addCommand('replace-figure-panel-image', ReplaceFigurePanelImageCommand)
    config.addCommand('move-figure-panel-up', MoveFigurePanelCommand, { direction: 'up' })
    config.addCommand('move-figure-panel-down', MoveFigurePanelCommand, { direction: 'down' })

    config.addCommand('add-author', AddAuthorCommand)

    // Menus
    const editorToolbar = {
      type: 'toolbar',
      style: 'plain',
      size: 'small',
      items: [
        { command: 'undo', icon: 'undo', tooltip: 'Undo' },
        { command: 'redo', icon: 'redo', tooltip: 'Redo' },
        { type: 'separator' },
        { command: 'toggle-bold', icon: 'bold', tooltip: 'Bring attention to' },
        { command: 'toggle-italic', icon: 'italic', tooltip: 'Introduce to' },
        { command: 'toggle-strike', icon: 'strikethrough', tooltip: 'Strike Through' },
        { command: 'toggle-subscript', icon: 'subscript', tooltip: 'Subscript' },
        { command: 'toggle-superscript', icon: 'superscript', tooltip: 'Superscript' },
        { command: 'create-link', icon: 'link', tooltip: 'Link' },
        {
          type: 'menu',
          label: 'Document',
          hideWhenDisabled: false,
          items: [
            { command: 'add-author', label: 'Add Author' }
          ]
        },
        {
          type: 'menu',
          label: 'Figure',
          hideWhenDisabled: false,
          items: [
            { command: 'insert-figure-panel', label: 'Insert Panel' },
            { command: 'remove-figure-panel', label: 'Remove Panel' },
            { command: 'replace-figure-panel-image', label: 'Replace Panel Image' },
            { command: 'move-figure-panel-up', label: 'Move Panel Up' },
            { command: 'move-figure-panel-down', label: 'Move Panel Down' }
          ]
        },
        { type: 'fill' }
      ]
    }

    config.addToolPanel('editor-toolbar', editorToolbar)

    // labels
    config.addLabel('paragraph', 'Paragraph')
    config.addLabel('heading', 'Heading')
  }
}

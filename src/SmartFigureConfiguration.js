import {
  Configurator, DefaultHtmlImporter, HTMLExporter,
  UndoCommand, RedoCommand, SelectAllCommand,
  AnnotationCommand, BasePackage, HtmlConverters,
  ParagraphComponent, HeadingComponent, OpenIsolatedNodeComponent,
  ImageComponent, LinkComponent, CreateLinkCommand,
  AddAuthorCommand, InsertAuthorCommand, EditAuthorCommand, RemoveAuthorCommand, MoveAuthorCommand,
  AddAffiliationCommand, InsertAffiliationCommand, EditAffiliationCommand, RemoveAffiliationCommand, MoveAffiliationCommand
} from 'substance'

import SmartFigureLoader from './model/SmartFigureLoader'
import SmartFigureComponent from './components/SmartFigureComponent'
import AddPanelCommand from './commands/AddPanelCommand'
import InsertPanelCommand from './commands/InsertPanelCommand'
import RemovePanelCommand from './commands/RemovePanelCommand'
import ReplacePanelImageCommand from './commands/ReplacePanelImageCommand'
import MovePanelCommand from './commands/MovePanelCommand'
import AddFileCommand from './commands/AddFileCommand'
import EditFileCommand from './commands/EditFileCommand'
import MoveFileCommand from './commands/MoveFileCommand'
import AddResourceCommand from './commands/AddResourceCommand'
import AddKeywordGroupCommand from './commands/AddKeywordGroupCommand'
import EditKeywordGroupCommand from './commands/EditKeywordGroupCommand'
import MoveKeywordGroupCommand from './commands/MoveKeywordGroupCommand'
import RemoveKeywordGroupCommand from './commands/RemoveKeywordGroupCommand'
import AttachFileCommand from './commands/AttachFileCommand'
import AttachResourceCommand from './commands/AttachResourceCommand'
import ContextualDropdownMenu from './components/ContextualDropdownMenu'
import RemoveFileCommand from './commands/RemoveFileCommand'
import RemoveAttachedFileCommand from './commands/RemoveAttachedFileCommand'
import MoveAttachedFileCommand from './commands/MoveAttachedFileCommand'
import JumpToItemCommand from './commands/JumpToItemCommand'
import RemoveAttachedResourceCommand from './commands/RemoveAttachedResourceCommand'
import MoveAttachedResourceCommand from './commands/MoveAttachedResourceCommand'
import RemoveResourceCommand from './commands/RemoveResourceCommand'
import MoveResourceCommand from './commands/MoveResourceCommand'

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
    config.addCommand('add-panel', AddPanelCommand)
    config.addCommand('insert-panel', InsertPanelCommand)
    config.addCommand('remove-panel', RemovePanelCommand)
    config.addCommand('replace-panel-image', ReplacePanelImageCommand)
    config.addCommand('move-panel-up', MovePanelCommand, { direction: 'up' })
    config.addCommand('move-panel-down', MovePanelCommand, { direction: 'down' })

    config.addCommand('add-keyword-group', AddKeywordGroupCommand)
    config.addCommand('edit-keyword-group', EditKeywordGroupCommand)
    config.addCommand('remove-keyword-group', RemoveKeywordGroupCommand)
    config.addCommand('move-keyword-group-up', MoveKeywordGroupCommand, { direction: 'up' })
    config.addCommand('move-keyword-group-down', MoveKeywordGroupCommand, { direction: 'down' })

    config.addCommand('attach-file', AttachFileCommand)
    config.addCommand('remove-attached-file', RemoveAttachedFileCommand)
    config.addCommand('move-attached-file-up', MoveAttachedFileCommand, { direction: 'up' })
    config.addCommand('move-attached-file-down', MoveAttachedFileCommand, { direction: 'down' })
    config.addCommand('jump-to-file', JumpToItemCommand, { propertySelector: 'panel.files' })

    config.addCommand('attach-resource', AttachResourceCommand)
    config.addCommand('remove-attached-resource', RemoveAttachedResourceCommand)
    config.addCommand('move-attached-resource-up', MoveAttachedResourceCommand, { direction: 'up' })
    config.addCommand('move-attached-resource-down', MoveAttachedResourceCommand, { direction: 'down' })
    config.addCommand('jump-to-resource', JumpToItemCommand, { propertySelector: 'panel.resources' })

    config.addCommand('add-author', AddAuthorCommand)
    config.addCommand('edit-author', EditAuthorCommand)
    config.addCommand('insert-author', InsertAuthorCommand)
    config.addCommand('remove-author', RemoveAuthorCommand)
    config.addCommand('move-author-forward', MoveAuthorCommand, { direction: 'up' })
    config.addCommand('move-author-back', MoveAuthorCommand, { direction: 'down' })

    config.addCommand('add-affiliation', AddAffiliationCommand)
    config.addCommand('insert-affiliation', InsertAffiliationCommand)
    config.addCommand('edit-affiliation', EditAffiliationCommand)
    config.addCommand('remove-affiliation', RemoveAffiliationCommand)
    config.addCommand('move-affiliation-forward', MoveAffiliationCommand, { direction: 'up' })
    config.addCommand('move-affiliation-back', MoveAffiliationCommand, { direction: 'down' })

    config.addCommand('add-file', AddFileCommand)
    config.addCommand('edit-file', EditFileCommand)
    config.addCommand('remove-file', RemoveFileCommand)
    config.addCommand('move-file-up', MoveFileCommand, { direction: 'up' })
    config.addCommand('move-file-down', MoveFileCommand, { direction: 'down' })

    config.addCommand('add-resource', AddResourceCommand)
    config.addCommand('remove-resource', RemoveResourceCommand)
    config.addCommand('move-resource-up', MoveResourceCommand, { direction: 'up' })
    config.addCommand('move-resource-down', MoveResourceCommand, { direction: 'down' })

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
          label: 'Smart Figure',
          hideWhenDisabled: false,
          noIcons: true,
          items: [
            { command: 'add-author', label: 'Add Author' },
            { command: 'add-affiliation', label: 'Add Affiliation' },
            { command: 'add-panel', label: 'Add Panel' },
            { command: 'add-file', label: 'Add File' },
            { command: 'add-resource', label: 'Add Resource' }
          ]
        },
        {
          type: 'menu',
          noIcons: true,
          ComponentClass: ContextualDropdownMenu
        },
        { type: 'fill' }
      ]
    }

    config.addToolPanel('editor-toolbar', editorToolbar)

    // context menus
    config.addToolPanel('context-menu:text', {
      type: 'menu',
      items: [
        { command: 'toggle-bold', icon: 'bold', label: 'Bold' },
        { command: 'toggle-italic', icon: 'italic', label: 'Italic' },
        { command: 'toggle-strike', icon: 'strikethrough', label: 'Strike Through' },
        { command: 'toggle-subscript', icon: 'subscript', label: 'Subscript' },
        { command: 'toggle-superscript', icon: 'superscript', label: 'Superscript' },
        { command: 'create-link', icon: 'link', label: 'Link' }
      ]
    })
    config.addToolPanel('context-menu:panel', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'insert-panel', label: 'Insert Panel' },
        { command: 'remove-panel', label: 'Remove Panel' },
        { command: 'replace-panel-image', label: 'Replace Image' },
        { command: 'move-panel-up', label: 'Move Panel Up' },
        { command: 'move-panel-down', label: 'Move Panel Down' },
        { command: 'add-keyword-group', label: 'Add Keyword Group' },
        { command: 'attach-file', label: 'Attach File' },
        { command: 'attach-resource', label: 'Attach Resource' }
      ]
    })

    config.addToolPanel('context-menu:author', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'edit-author', label: 'Edit Author' },
        { command: 'remove-author', label: 'Remove Author' },
        { command: 'insert-author', label: 'Insert Author' },
        { command: 'move-author-forward', label: 'Move Author Up' },
        { command: 'move-author-back', label: 'Move Author Down' }
      ]
    })

    config.addToolPanel('context-menu:affiliation', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'edit-affiliation', label: 'Edit Affiliation' },
        { command: 'remove-affiliation', label: 'Remove Affiliation' },
        { command: 'insert-affiliation', label: 'Insert Affiliation' },
        { command: 'move-affiliation-forward', label: 'Move Affiliation Up' },
        { command: 'move-affiliation-back', label: 'Move Affiliation Down' }
      ]
    })

    config.addToolPanel('context-menu:keyword-group', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'add-keyword-group', label: 'Add Keword Group' },
        { command: 'edit-keyword-group', label: 'Edit Keword Group' },
        { command: 'remove-keyword-group', label: 'Remove Keword Group' },
        { command: 'move-keyword-group-up', label: 'Move Keword Group Up' },
        { command: 'move-keyword-group-down', label: 'Move Keword Group Down' }
      ]
    })

    config.addToolPanel('context-menu:file', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'edit-file', label: 'Rename File' },
        { command: 'remove-file', label: 'Remove File' },
        { command: 'move-file-up', label: 'Move File Up' },
        { command: 'move-file-down', label: 'Move File Down' }
      ]
    })

    config.addToolPanel('context-menu:resource', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'remove-resource', label: 'Remove Resource' },
        { command: 'move-resource-up', label: 'Move Resource Up' },
        { command: 'move-resource-down', label: 'Move Resource Down' }
      ]
    })

    config.addToolPanel('context-menu:panel.files', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'attach-file', label: 'Attach File' },
        { command: 'remove-attached-file', label: 'Remove Attached File' },
        { command: 'move-attached-file-up', label: 'Move Attached File Up' },
        { command: 'move-attached-file-down', label: 'Move Attached File Down' },
        { command: 'jump-to-file', label: 'Jump to File' }
      ]
    })

    config.addToolPanel('context-menu:panel.resources', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'attach-resource', label: 'Attach Resource' },
        { command: 'remove-attached-resource', label: 'Remove Attached Resource' },
        { command: 'move-attached-resource-up', label: 'Move Attached Resource Up' },
        { command: 'move-attached-resource-down', label: 'Move Attached Resource Down' },
        { command: 'jump-to-resource', label: 'Jump to Resource' }
      ]
    })

    // labels
    config.addLabel('paragraph', 'Paragraph')
    config.addLabel('heading', 'Heading')
    config.addLabel('author', 'Author')
    config.addLabel('affiliation', 'Affiliation')
    config.addLabel('panel', 'Figure Panel')
    config.addLabel('panel.files', 'Attached File')
    config.addLabel('panel.resources', 'Attached Resource')
    config.addLabel('keyword-group', 'Keyword Group')
    config.addLabel('file', 'File')
    config.addLabel('resource', 'Resource')
  }
}

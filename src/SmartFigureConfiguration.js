import {
  Configurator, DefaultHtmlImporter, HTMLExporter,
  BasePackage, HtmlConverters, ParagraphComponent, HeadingComponent,
  OpenIsolatedNodeComponent, ImageComponent, LinkComponent,
  UndoCommand, RedoCommand, SelectAllCommand, AnnotationCommand, CreateLinkCommand,
  MoveItemCommand, RemoveItemCommand, MoveValueCommand, RemoveValueCommand,
  AddAuthorCommand, InsertAuthorCommand, EditAuthorCommand,
  AddAffiliationCommand, InsertAffiliationCommand, EditAffiliationCommand
} from 'substance'

import SmartFigureLoader from './model/SmartFigureLoader'
import SmartFigureComponent from './components/SmartFigureComponent'
import InsertPanelCommand from './commands/InsertPanelCommand'
import ReplacePanelImageCommand from './commands/ReplacePanelImageCommand'
import RenamePanelImageCommand from './commands/RenamePanelImageCommand'
import AddFileCommand from './commands/AddFileCommand'
import RenameFileCommand from './commands/RenameFileCommand'
import AddResourceCommand from './commands/AddResourceCommand'
import AddKeywordGroupCommand from './commands/AddKeywordGroupCommand'
import EditKeywordGroupCommand from './commands/EditKeywordGroupCommand'
import AttachFileCommand from './commands/AttachFileCommand'
import AttachResourceCommand from './commands/AttachResourceCommand'
import ContextualDropdownMenu from './components/ContextualDropdownMenu'
import JumpToItemCommand from 'substance/commons/JumpToItemCommand'

const {
  ParagraphConverter, BoldConverter, ItalicConverter,
  StrikeConverter, SubscriptConverter, SuperscriptConverter,
  LinkConverter
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
    config.addConverter('html', BoldConverter)
    config.addConverter('html', ItalicConverter)
    config.addConverter('html', StrikeConverter)
    config.addConverter('html', SubscriptConverter)
    config.addConverter('html', SuperscriptConverter)
    config.addConverter('html', LinkConverter)
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
    config.addCommand('insert-panel', InsertPanelCommand)
    config.addCommand('remove-panel', RemoveItemCommand, { type: 'panel' })
    config.addCommand('rename-panel-image', RenamePanelImageCommand)
    config.addCommand('replace-panel-image', ReplacePanelImageCommand)
    config.addCommand('move-panel-up', MoveItemCommand, { type: 'panel', direction: 'up' })
    config.addCommand('move-panel-down', MoveItemCommand, { type: 'panel', direction: 'down' })

    config.addCommand('add-keyword-group', AddKeywordGroupCommand)
    config.addCommand('edit-keyword-group', EditKeywordGroupCommand)
    config.addCommand('remove-keyword-group', RemoveItemCommand, { type: 'keyword-group' })
    config.addCommand('move-keyword-group-up', MoveItemCommand, { type: 'keyword-group', direction: 'up' })
    config.addCommand('move-keyword-group-down', MoveItemCommand, { type: 'keyword-group', direction: 'down' })

    config.addCommand('attach-file', AttachFileCommand)
    config.addCommand('remove-attached-file', RemoveValueCommand, { propertySelector: 'panel.files' })
    config.addCommand('move-attached-file-up', MoveValueCommand, { propertySelector: 'panel.files', direction: 'up' })
    config.addCommand('move-attached-file-down', MoveValueCommand, { propertySelector: 'panel.files', direction: 'down' })
    config.addCommand('jump-to-file', JumpToItemCommand, { propertySelector: 'panel.files' })

    config.addCommand('attach-resource', AttachResourceCommand)
    config.addCommand('remove-attached-resource', RemoveValueCommand, { propertySelector: 'panel.resources' })
    config.addCommand('move-attached-resource-up', MoveValueCommand, { propertySelector: 'panel.resources', direction: 'up' })
    config.addCommand('move-attached-resource-down', MoveValueCommand, { propertySelector: 'panel.resources', direction: 'down' })
    config.addCommand('jump-to-resource', JumpToItemCommand, { propertySelector: 'panel.resources' })

    config.addCommand('add-author', AddAuthorCommand)
    config.addCommand('edit-author', EditAuthorCommand)
    config.addCommand('insert-author', InsertAuthorCommand)
    config.addCommand('remove-author', RemoveItemCommand, { type: 'author' })
    config.addCommand('move-author-left', MoveItemCommand, { type: 'author', direction: 'up' })
    config.addCommand('move-author-right', MoveItemCommand, { type: 'author', direction: 'down' })

    config.addCommand('add-affiliation', AddAffiliationCommand)
    config.addCommand('insert-affiliation', InsertAffiliationCommand)
    config.addCommand('edit-affiliation', EditAffiliationCommand)
    config.addCommand('remove-affiliation', RemoveItemCommand, { type: 'affiliation' })
    config.addCommand('move-affiliation-up', MoveItemCommand, { type: 'affiliation', direction: 'up' })
    config.addCommand('move-affiliation-down', MoveItemCommand, { type: 'affiliation', direction: 'down' })

    config.addCommand('add-file', AddFileCommand)
    config.addCommand('rename-file', RenameFileCommand)
    config.addCommand('remove-file', RemoveItemCommand, { type: 'file' })
    config.addCommand('move-file-up', MoveItemCommand, { type: 'file', direction: 'up' })
    config.addCommand('move-file-down', MoveItemCommand, { type: 'file', direction: 'down' })

    config.addCommand('add-resource', AddResourceCommand)
    config.addCommand('remove-resource', RemoveItemCommand, { type: 'resource' })
    config.addCommand('move-resource-up', MoveItemCommand, { type: 'resource', direction: 'up' })
    config.addCommand('move-resource-down', MoveItemCommand, { type: 'resource', direction: 'down' })

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
            { command: 'insert-panel', label: 'Add Panel' },
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
        { command: 'rename-panel-image', label: 'Rename Image' },
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
        { command: 'insert-author', label: 'Insert Author' },
        { command: 'edit-author', label: 'Edit Author' },
        { command: 'remove-author', label: 'Remove Author' },
        { command: 'move-author-left', label: 'Move Author Left' },
        { command: 'move-author-right', label: 'Move Author Right' }
      ]
    })

    config.addToolPanel('context-menu:affiliation', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'insert-affiliation', label: 'Insert Affiliation' },
        { command: 'edit-affiliation', label: 'Edit Affiliation' },
        { command: 'remove-affiliation', label: 'Remove Affiliation' },
        { command: 'move-affiliation-up', label: 'Move Affiliation Up' },
        { command: 'move-affiliation-down', label: 'Move Affiliation Down' }
      ]
    })

    config.addToolPanel('context-menu:keyword-group', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'add-keyword-group', label: 'Insert Keword Group' },
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
        { command: 'add-file', label: 'Insert File' },
        { command: 'rename-file', label: 'Rename File' },
        { command: 'remove-file', label: 'Remove File' },
        { command: 'move-file-up', label: 'Move File Up' },
        { command: 'move-file-down', label: 'Move File Down' }
      ]
    })

    config.addToolPanel('context-menu:resource', {
      type: 'menu',
      noIcons: true,
      items: [
        { command: 'add-resource', label: 'Insert Resource' },
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

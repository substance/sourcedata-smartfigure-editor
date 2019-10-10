/* eslint-disable no-template-curly-in-string */
export default {
  name: 'figure-packagae-toolbar',
  configure (config) {
    config.addToolPanel('toolbar', [
      {
        name: 'document-tools',
        type: 'group',
        style: 'minimal',
        items: [
          { type: 'command', name: 'undo' },
          { type: 'command', name: 'redo' },
          { type: 'command', name: 'save' }
        ]
      },
      {
        name: 'primary-annotations',
        type: 'group',
        style: 'minimal',
        items: [
          { type: 'command', name: 'toggle-bold', label: 'bold', icon: 'bold' },
          { type: 'command', name: 'toggle-italic', label: 'italic', icon: 'italic' },
          { type: 'command', name: 'create-external-link', label: 'link', icon: 'link' }
        ]
      },
      {
        name: 'insert',
        type: 'dropdown',
        style: 'descriptive',
        hideDisabled: true,
        alwaysVisible: true,
        items: [
          { type: 'command', name: 'add-author', label: 'author' },
          { type: 'command', name: 'add-affiliation', label: 'affiliation' },
          { type: 'command', name: 'add-reference', label: 'reference' },
          { type: 'command', name: 'insert-inline-formula', label: 'math' },
          { type: 'command', name: 'insert-inline-graphic', label: 'inline-graphic' },
          { type: 'command', name: 'insert-xref-bibr', label: 'citation' }
        ]
      },
      {
        name: 'format',
        type: 'dropdown',
        style: 'descriptive',
        items: [
          { type: 'command', name: 'toggle-bold', label: 'bold' },
          { type: 'command', name: 'toggle-italic', label: 'italic' },
          { type: 'command', name: 'toggle-subscript', label: 'subscript' },
          { type: 'command', name: 'toggle-superscript', label: 'superscript' },
          { type: 'command', name: 'toggle-monospace', label: 'monospace' },
          { type: 'command', name: 'toggle-small-caps', label: 'small-caps' },
          { type: 'command', name: 'toggle-underline', label: 'underline' },
          { type: 'command', name: 'toggle-overline', label: 'overline' },
          { type: 'command', name: 'toggle-strike-through', label: 'strike-through' }
        ]
      },
      {
        name: 'Figure',
        type: 'dropdown',
        style: 'descriptive',
        hideDisabled: false,
        items: [
          { type: 'command', name: 'insert-figure-panel', label: 'Insert Panel' },
          { type: 'command', name: 'remove-figure-panel', label: 'Remove Panel' }
        ]
      },
      {
        // FIXME: Texture.ToolGroup should only set a ref if name is present
        name: 'foo',
        type: 'spacer'
      }
    ], { force: true })

    // Context menus
    config.addToolPanel('context-menu', [
      {
        name: 'context-menu',
        type: 'group',
        style: 'descriptive',
        hideDisabled: true,
        items: [
        ]
      }
    ], { force: true })
  }
}

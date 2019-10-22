import { Component, $$ } from 'substance'

export default class AuthorsListComponent extends Component {
  didMount () {
    const node = this.props.node
    this.context.editorState.addObserver(['document'], this.rerender, this, {
      document: {
        path: [node.id, 'authors']
      },
      stage: 'render'
    })
  }

  dispose () {
    this.context.editorState.off(this)
  }

  render () {
    const node = this.props.node
    const el = $$('div', { class: 'sc-authors-list' })

    const authors = node.resolve('authors')
    if (authors && authors.length > 0) {
      // Note: in the spirit to avoid unnecessary conventions we
      // do not dictate if authors are ordered
      for (const author of authors) {
        el.append(
          $$(AuthorComponent, { node: author })
        )
      }
    } else {
      el.addClass('sm-empty')
    }

    return el
  }
}

class AuthorComponent extends Component {
  render () {
    const node = this.props.node
    const el = $$('div', { class: 'sc-author' })
    // Note: abbreviating the first name
    el.append(
      $$('span', { class: 'se-first-name' }, _abbreviated(node.firstName)),
      $$('span', { class: 'se-last-name' }, node.lastName)
    )
    return el
  }
}

function _abbreviated (str) {
  if (str) {
    return str[0].toUpperCase() + '.'
  }
}

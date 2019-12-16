import { $$ } from 'substance'

export default function Heading (props) {
  const level = props.level
  return (
    $$('h' + level, { class: 'sc-heading' },
      props.children
    ).addClass('sm-level-' + level)
  )
}

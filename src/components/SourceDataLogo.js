import { $$, HorizontalStack, Title } from 'substance'

export default function SourceDataLogo (props) {
  return $$('div', { class: 'sc-sourcedata-logo' },
    $$(HorizontalStack, {},
      $$('img', { src: '/images/sourcedata-logo.jpg' }),
      $$(Title, {}, 'SourceData')
    ).addClass('sm-nospacing')
  )
}

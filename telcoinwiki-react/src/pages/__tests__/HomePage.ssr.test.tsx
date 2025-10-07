import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import { HomePage } from '../HomePage'

describe('HomePage SSR', () => {
  it('renders meaningful marketing copy without client JavaScript', () => {
    const markup = renderToStaticMarkup(
      <StaticRouter location="/">
        <HomePage />
      </StaticRouter>,
    )

    expect(markup).toContain('Understand the Telcoin platform in minutes')
    expect(markup).toContain('Choose a pathway tailored to your goal')
    expect(markup).toContain('Volunteer editors, community ambassadors, and early adopters share verified answers')
  })
})

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

    // Check for hero + narrative markers that should exist server-side
    expect(markup).toContain('Home')
    expect(markup).toContain('The Problem')
    expect(markup).toContain('The Telcoin Model')
  })
})

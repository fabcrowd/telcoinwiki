import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { HomePage } from '../HomePage'

describe('HomePage static rendering', () => {
  it('includes meaningful marketing content without client-side JavaScript', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(markup).toContain('Understand the Telcoin platform in minutes')
    expect(markup).toContain('Choose a pathway tailored to your goal')
  })
})

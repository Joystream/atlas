describe('Sidebar', () => {
  it('open sidebar and go to sign in screen', () => {
    cy.get('button[aria-label="Main menu"').click()
    cy.get('a').contains('Joystream studio').click()
    cy.get('a span').contains('Sign in').should('exist')
  })
})

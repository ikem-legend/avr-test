describe('Account Page', () => {
  const user = cy
  beforeEach(() => {
    user.login()
    user.visit('/my-account')
  })

  it('greets with my account', () => {
    user
      .findAllByText(/My Account/i)
      .last()
      .should('be.visible')
  })

  it('shows user details', () => {
    user.findByTestId('username-display')
    .should('have.text', 'Franklyn Ocean')
    user.findByTestId('email-display')
    .should('have.text', 'frank@ocean.com')
  })
})

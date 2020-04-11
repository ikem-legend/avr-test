describe('Transactions Page', () => {
  const user = cy
  beforeEach(() => {
    cy.fixture('signin').as('signinJSON')
    cy.fixture('user').as('usersJSON')
    cy.server()
    cy.route('POST', '/api/v1/auth/signin', '@signinJSON')
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')
    cy.route('GET', '/api/v1/user/plaid/bank/get/transactions', '@signinJSON')
    cy.route('GET', '/api/v1/user/wallet/fund', '@signinJSON')
    cy.route('GET', '/api/v1/user/withdraw/fund', '@signinJSON')
    cy.visit('/account/login')
      .findByLabelText(/email/i)
      .type('a.phillip@gmail.com')
      .findByLabelText(/password/i)
      .type('Password@1')
      .findByText(/login/i)
      .click()
      .assertHome()
      .visit('/transactions')
  })

  it.only('greets with avenir rounds up your everyday credit card', () => {
    user
      .findByText(
        /Avenir rounds up your everyday credit card purchases to the nearest dollar and invests the nearest cents/i,
      )
      .should('be.visible')
  })

  // it.only('tops up a user investment', () => {
  //   user.findByPlaceholderText(/enter amount/i).type(10)
  //   user
  //     .findByText(/invest now/i)
  //     .click()
  //     .findByRole('alert')
  //     .should('be.visible')
  //     .should('contain', `Top-up made successfully`)
  // })
})

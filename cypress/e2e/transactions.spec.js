describe('Transactions Page', () => {
  before(() => {
    cy.fixture('signin').as('signinJSON')
    cy.fixture('topup').as('topupJSON')
    cy.fixture('roundup').as('roundupJSON')
    cy.fixture('user').as('usersJSON')
    cy.server()
    cy.route('POST', '/api/v1/auth/signin', '@signinJSON')
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')
    cy.route('GET', '/api/v1/user/plaid/bank/get/transactions', '@roundupJSON')
    cy.route('GET', '/api/v1/user/wallet/fund', '@topupJSON')
    cy.route('POST', '/api/v1/user/wallet/fund', {
      data: {
        id: 3,
        amount: '10',
        investment_distributions: [
          {currency: 'BTC', amount: '5.5'},
          {currency: 'ETH', amount: '4.5'},
        ],
        status: 'processing',
        dateCreated: '04-13-2020',
      },
    })
    cy.route('GET', '/api/v1/user/withdraw/fund', '@roundupJSON')
    cy.route('POST', '/api/v1/user/multipliers', {
      data: {message: 'Your multiplier settings has been updated'},
    })

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
    cy.findByText(
      /Avenir rounds up your everyday credit card purchases to the nearest dollar and invests the nearest cents/i,
    ).should('be.visible')
  })

  it.only('should toggle investment pause and resume', () => {
    cy.server()
    cy.route('POST', '/api/v1/user/investment/status', {
      data: {message: 'investment status has been deactivated'},
    })

    cy.get('#roundupsSwitch').click({force: true})
    // .get('.Toastify__toast-body', {timeout: 10000})
    // .should('contain.text', 'Round-up successfully updated')
    // .should('be.visible')
    // .should('have.value', false)
  })
})

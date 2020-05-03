describe('Connect Account Page', () => {
  const getIframeBody = () => {
    return cy
      .get('#plaid-link-iframe-1')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
  }

  const getIframeWindow = () => {
    return cy
      .get('#plaid-link-iframe-1')
      .its('0.contentWindow')
      .should('exist')
  }

  const replaceIFrameFetchWithXhr = () => {
    // see recipe "Stubbing window.fetch" in
    // https://github.com/cypress-io/cypress-example-recipes
    getIframeWindow().then(iframeWindow => {
      // BUT to be able to spy on XHR or stub XHR requests
      // from the iframe we need to copy OUR window.XMLHttpRequest into the iframe
      cy.window().then(appWindow => {
        iframeWindow.XMLHttpRequest = appWindow.XMLHttpRequest
      })
    })
  }

  before(() => {
    cy.fixture('signin').as('signinJSON')
    cy.fixture('user').as('usersJSON')
    cy.fixture('rates').as('ratesJSON')
    cy.server()
    cy.route('POST', '/api/v1/auth/signin', '@signinJSON')
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')
    cy.route('GET', 'https://api.sendwyre.com/v3/rates', '@ratesJSON')
    cy.route('POST', '/api/v1/user/distributions', {
      data: {message: 'Your currency distribution has been updated'},
    })
    cy.visit('/account/login')
      .findByLabelText(/email/i)
      .type('a.phillip@gmail.com')
      .findByLabelText(/password/i)
      .type('Password@1')
      .findByText(/login/i)
      .click()
      .assertHome()
      .visit('/account/account-connect')
  })

  it('should successfully link account to plaid ', () => {
    replaceIFrameFetchWithXhr()
    cy.fixture('account').as('accountJSON')
    cy.fixture('plaid').as('plaidJSON')
    cy.fixture('client_visible_event').as('clientEventJSON')
    cy.server()
    cy.route('POST', '/api/v1/user/plaid/bank', '@accountJSON').as('banks')
    cy.route('POST', '/api/v1/user/plaid/bank/account/link', {
      data: {message: 'your account has been linked'},
    })
    cy.route(
      'POST',
      'https://sandbox.plaid.com/link/item/create',
      '@plaidJSON',
    ).as('create')
    cy.route(
      'POST',
      'https://sandbox.plaid.com/link/client_visible_event/create',
      '@clientEventJSON',
    ).as('clientEvent')

    cy.findByText(/connect my funding account/i).click()

    getIframeBody()
      .findByText('Continue', {timeout: 5000})
      .click()
    getIframeBody()
      .find('li')
      .first()
      .click({force: true})
    getIframeBody()
      .wait(2000)
      .findByLabelText(/user id/i)
      .click({force: true})
      .type('user_good')
    getIframeBody()
      .findByLabelText(/password/i)
      .click({force: true})
      .type('pass_good')
    getIframeBody()
      .findByText(/submit/i)
      .click({force: true})

    getIframeBody().wait('@create')

    getIframeBody()
      .findByText(/continue/i, {timeout: 10000})
      .click({force: true})

    getIframeBody().wait('@clientEvent')

    getIframeBody()
      .wait('@banks')
      .get('.linked', {timeout: 20000})
      .first()
      .click({force: true})
      .findByText(/continue/i, {timeout: 10000})
      .click({force: true})
      .get('.Toastify__toast-body', {timeout: 10000})
      .should('contain.text', 'Account(s) successfully linked')
      .should('be.visible')
      .get('input[name="btc"]', {timeout: 10000})
      .clear()
      .type('30')
      .get('input[name="eth"]')
      .should('have.value', '70')
      .wait(2000)
      .findByText(/save/i, {timeout: 10000})
      .click()
      .get('.Toastify__toast-body', {timeout: 10000})
      .should('contain.text', 'Currency ratio successfully updated')
      .should('be.visible')
      .url()
      .should('include', '/dashboard')
  })
})

describe('Login Page', () => {
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
      delete iframeWindow.fetch
      // since the application code does not ship with a polyfill
      // load a polyfilled "fetch" from the test
      iframeWindow.eval(polyfill)
      iframeWindow.fetch = iframeWindow.unfetch

      // BUT to be able to spy on XHR or stub XHR requests
      // from the iframe we need to copy OUR window.XMLHttpRequest into the iframe
      cy.window().then(appWindow => {
        iframeWindow.XMLHttpRequest = appWindow.XMLHttpRequest
      })
    })
  }

  const user = cy
  before(() => {
    user
      .visit('/account/login')
      .findByLabelText(/email/i)
      .type('a.phillip@gmail.com')
      .findByLabelText(/password/i)
      .type('Password@1')
      .findByText(/login/i)
      .click()
      .assertHome()
      .visit('/account/account-connect')

    //   user.server()
    //     cy.fixture('plaid').as('plaidJSON')
    //     user.route('POST', 'https://sandbox.plaid.com/link/item/create', 'plaid').as('linkaccount')
  })

  // it('should render connect page correctly', () => {
  //   user
  //   .findByText(/connect your bank account/i)
  //   .should('be.visible')
  // })

  it('should render plaid modal ', () => {
    user.findByText(/connect my funding account/i).click()

    getIframeBody()
      .findByText('Continue')
      .click()
    getIframeBody()
      .find('li')
      .first()
      .click({force: true})
    getIframeBody()
      .findByLabelText(/user id/i)
      .type('user_good')
    getIframeBody()
      .findByLabelText(/password/i)
      .type('pass_good')

    getIframeBody()
      .findByText(/submit/i)
      .click({force: true})
    // getIframeWindow().then((win) => {
    //     cy.spy(win, 'fetch').as('fetch')
    //    })
    // cy.get('@fetch').should('have.been.calledOnce')
  })

  //
})

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('assertHome', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
})

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: 'https://myavenir.herokuapp.com/api/v1/auth/signin',
    body: {
      email: 'a.phillip@gmail.com',
      password: 'Password@1',
    },
  })
    .then(resp => {
      cy.request({
        method: 'GET',
        url: 'https://myavenir.herokuapp.com/api/v1/auth/me',
        headers: {
          Authorization: `Bearer ${resp.body.token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
    })
    .then(result => {
      const {
        data: {myFirstName, myLastName, myEmailAddress, myPhoneNumber},
      } = result.body
      const userObj = {}
      Object.assign(
        userObj,
        {myFirstName, myLastName, myEmailAddress, myPhoneNumber},
        {token: result.token},
      )
      cy.setCookie('avenirUser', JSON.stringify(userObj))
    })
})

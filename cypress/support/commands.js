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
    url: 'https://avenir-backend.herokuapp.com/api/v1/auth/signin',
    body: {
      email: 'a.phillip@gmail.com',
      password: 'Password@1',
    },
  })
    .then(resp => {
      cy.request({
        method: 'GET',
        url: 'https://avenir-backend.herokuapp.com/api/v1/auth/me',
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

Cypress.Commands.add(
  'dropFile',
  {
    prevSubject: false,
  },
  fileName => {
    Cypress.log({
      name: 'dropFile',
    })
    return cy
      .fixture(fileName, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => {
        // instantiate File from `application` window, not cypress window
        return cy.window().then(win => {
          const file = new win.File([blob], fileName)
          const dataTransfer = new win.DataTransfer()
          dataTransfer.items.add(file)

          return cy.document().trigger('drop', {
            dataTransfer,
          })
        })
      })
  },
)

// Cypress.Commands.add('uploadFile', (fileNamePath, fileName, fileType = ' ', selector) => {
//   cy.get(selector).then(subject => {
//       cy.fixture(fileNamePath, 'base64')
//           .then(Cypress.Blob.base64StringToBlob)
//           .then(blob => {
//               const el = subject[0]
//               const testFile = new File([blob], fileName, {
//                   type: fileType
//               })
//               const dataTransfer = new DataTransfer()
//               dataTransfer.items.add(testFile)
//               el.files = dataTransfer.files
//           })
//   })

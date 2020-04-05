import {buildUser} from '../support/generator'

// describe('Edit Profile in Account Page', () => {

//   before(() => {
//     cy.fixture('signin').as('signinJSON')
//     cy.fixture('user').as('usersJSON')
//     cy.server();
//     cy.route('POST', '/api/v1/auth/signin', '@signinJSON')
//     cy.route('GET', '/api/v1/auth/me', '@usersJSON')
//     cy.route('POST', '/api/v1/user/distributions', { "data": { "message": "Your currency distribution has been updated" } })
//     cy
//       .visit('/account/login')
//       .findByLabelText(/email/i)
//       .type('a.phillip@gmail.com')
//       .findByLabelText(/password/i)
//       .type('Password@1')
//       .findByText(/login/i)
//       .click()
//       .assertHome()
//       .visit('/account/account-connect')
// })

//   it('should edit profile successfully', () => {
//     user
//       .wait(500)
//       .get('input[name="name"]')
//       .clear()
//       .type(`${customer.firstName} ${customer.lastName}`)
//       .get('input[name="email"]')
//       .clear()
//       .type('a.phillip@gmail.com')
//       .get('input[name="phone"]')
//       .clear()
//       .type(customer.phone)
//       .get('input[name="dob"]')
//       .click({force: true})
//       .get('.numInput')
//       .type('1995')
//       .get('.flatpickr-monthDropdown-months')
//       .select('April')
//       .get('[aria-label="April 7, 1995"]')
//       .click()
//       .get('input[name="address"]')
//       .click({force: true})
//       .clear()
//       .type(customer.streetAddress)
//       .get('[data-cy=edit-profile-save]')
//       .click()
//       .wait(500)
//       .findByText(/Profile updated successfully/i)
//       .should('be.visible')
//   })
// })

// describe('Account Settings in Account Page', () => {
//   before(() => {
//     cy.fixture('signin').as('signinJSON')
//     cy.fixture('user').as('usersJSON')
//     cy.server();
//     cy.route('POST', '/api/v1/auth/signin', '@signinJSON')
//     cy.route('GET', '/api/v1/auth/me', '@usersJSON')
//     cy.route('POST', '/api/v1/user/distributions', { "data": { "message": "Your currency distribution has been updated" } })
//     cy
//       .visit('/account/login')
//       .findByLabelText(/email/i)
//       .type('a.phillip@gmail.com')
//       .findByLabelText(/password/i)
//       .type('Password@1')
//       .findByText(/login/i)
//       .click()
//       .assertHome()
//       .visit('/my-account')
//   })

//   const user = cy

//   it('should contains text Round-Up Investment', () => {
//     user
//       .findByText(/account settings/i)
//       .click()
//       .findAllByText(/round-up investment/i)
//       .last()
//       .should('be.visible')
//   })

//   it('should update when round-up investment is paused or resumed', () => {
//     user
//       .findByText(/account settings/i)
//       .click()
//       .findByLabelText(/resume/i)
//       .check()
//   })

//   it('should set round-up multiplier to 10x when 10x button is clicked', () => {
//     user
//       .findByText(/account settings/i)
//       .click()
//       .findByText(/10x/i)
//       .click()
//       .get('.multiplier')
//       .should('have.text', '10x')
//   })

//   it('should update account setting successfully', () => {
//     cy.server();
//     cy.route('POST', '/api/v1/user/investment/status', {"data":{"message":"investment status has been deactivated"}})
//     cy.route('POST', '/api/v1/user/multipliers', {"data":{"message":"Your multiplier settings has been updated"}})
//     cy.route('POST', '/api/v1/user/distributions', {"data":{"message":"Your currency distribution has been updated"}})

//     user
//       .findByText(/account settings/i)
//       .click()
//       .get('input[name="btc"]')
//       .clear()
//       .type('30')
//       .get('input[name="eth"]')
//       .should('have.value', '70')
//       .get('[data-cy=account-setting-save]')
//       .click()
//       .findByText(/Multiplier successfully updated/i)
//       .should('be.visible')
//       .findByText(/Currency ratio successfully updated/i)
//       .should('be.visible')
//   })
// })

describe('Account Settings in Account Page', () => {
  before(() => {
    cy.fixture('signin').as('signinJSON')
    cy.fixture('user').as('usersJSON')
    cy.server()
    cy.route('POST', '/api/v1/auth/signin', '@signinJSON')
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')

    cy.visit('/account/login')
      .findByLabelText(/email/i)
      .type('a.phillip@gmail.com')
      .findByLabelText(/password/i)
      .type('Password@1')
      .findByText(/login/i)
      .click()
      .assertHome()
      .visit('/my-account')
  })

  const user = cy

  it('should contains text Two - Factor Authentication', () => {
    user
      .findAllByText(/security/i)
      .first()
      .click()
      .findAllByText(/Two - Factor Authentication/i)
      .last()
      .should('be.visible')
  })

  it('should update when round-up investment is paused or resumed', () => {
    // cy.fixture('signin').as('signinJSON')
    cy.fixture('user').as('usersJSON')
    cy.server()
    cy.route('POST', '/api/v1/user/two-factor-auth/status', {
      data: {message: 'two factor authentication has been deactivated'},
    })
    // cy.route('POST', '/api/v1/auth/signin', '@signinJSON')
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')

    user
      .get('#twoFASwitch')
      .click({force: true})
      .get('.Toastify__toast-body', {timeout: 10000})
      .should('contain.text', 'two factor authentication has been deactivated')
      .should('be.visible')
      .should('be.visible')
  })

  // it('should set round-up multiplier to 10x when 10x button is clicked', () => {
  //   user
  //     .findByText(/account settings/i)
  //     .click()
  //     .findByText(/10x/i)
  //     .click()
  //     .get('.multiplier')
  //     .should('have.text', '10x')
  // })

  // it('should update account setting successfully', () => {
  //   cy.server();
  //   cy.route('POST', '/api/v1/user/investment/status', {"data":{"message":"investment status has been deactivated"}})
  //   cy.route('POST', '/api/v1/user/multipliers', {"data":{"message":"Your multiplier settings has been updated"}})
  //   cy.route('POST', '/api/v1/user/distributions', {"data":{"message":"Your currency distribution has been updated"}})

  //   user
  //     .findByText(/account settings/i)
  //     .click()
  //     .get('input[name="btc"]')
  //     .clear()
  //     .type('30')
  //     .get('input[name="eth"]')
  //     .should('have.value', '70')
  //     .get('[data-cy=account-setting-save]')
  //     .click()
  //     .findByText(/Multiplier successfully updated/i)
  //     .should('be.visible')
  //     .findByText(/Currency ratio successfully updated/i)
  //     .should('be.visible')
  // })
})

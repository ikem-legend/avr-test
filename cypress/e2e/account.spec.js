import {buildUser} from '../support/generator'

describe('Edit Profile in Account Page', () => {
  before(() => {
    cy.fixture('signin').as('signinJSON')
    cy.fixture('user').as('usersJSON')
    cy.fixture('countries').as('countriesJSON')
    cy.server()
    cy.route('POST', '/api/v1/auth/signin', '@signinJSON')
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')
    cy.route('POST', '/api/v1/user/distributions', {
      data: {message: 'Your currency distribution has been updated'},
    })
    cy.route('POST', '/api/v1/user/profile/update', {
      data: {message: 'your profile has been updated'},
    })
    cy.route('GET', '/api/v1/data/countries', '@countriesJSON')

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

  it('should edit profile successfully', () => {
    const customer = buildUser()
    cy.findByText(/edit profile/i)
      .click()
      .get('input[name="firstName"]')
      .clear()
      .type(customer.firstName)
      .get('input[name="lastName"]')
      .clear()
      .type(customer.lastName)
      .get('input[name="email"]')
      .clear()
      .type('a.phillip@gmail.com')
      .get('input[name="phone"]')
      .clear()
      .type('09056418877')
      .get('input[name="dob"]')
      .click({force: true})
      .get('.numInput')
      .type('1995')
      .get('.flatpickr-monthDropdown-months')
      .select('April')
      .get('[aria-label="April 7, 1995"]')
      .click()
      .get('input[name="address"]')
      .click({force: true})
      .clear()
      .type(customer.streetAddress)
      .findAllByText(/upload user registration/i)
      .first()
      .click()
      .findAllByText(/save/i)
      .first()
      .click()
      .findByText(/Profile updated successfully/i)
      .should('be.visible')
  })
})

describe('Account Settings in Account Page', () => {
  before(() => {
    cy.fixture('signin').as('signinJSON')
    cy.fixture('user').as('usersJSON')
    cy.server()
    cy.route('POST', '/api/v1/auth/signin', '@signinJSON')
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')
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
      .visit('/my-account')
  })

  it('should contains text Round-Up Investment', () => {
    cy.findByText(/account settings/i)
      .click()
      .findAllByText(/round-up investment/i)
      .last()
      .should('be.visible')
  })

  it('should update when round-up investment is paused or resumed', () => {
    cy.findByText(/account settings/i)
      .click()
      .findByLabelText(/resume/i)
      .check()
  })

  it('should set round-up multiplier to 10x when 10x button is clicked', () => {
    cy.findByText(/account settings/i)
      .click()
      .findByText(/10x/i)
      .click()
      .get('.multiplier')
      .should('have.text', '10x')
  })

  it('should update account setting successfully', () => {
    cy.server()
    cy.route('POST', '/api/v1/user/investment/status', {
      data: {message: 'investment status has been deactivated'},
    })
    cy.route('POST', '/api/v1/user/multipliers', {
      data: {message: 'Your multiplier settings has been updated'},
    })
    cy.route('POST', '/api/v1/user/distributions', {
      data: {message: 'Your currency distribution has been updated'},
    })

    cy.findByText(/account settings/i)
      .click()
      .get('input[name="btc"]')
      .clear()
      .type('30')
      .get('input[name="eth"]')
      .should('have.value', '70')
      .get('[data-cy=account-setting-save]')
      .click()
      .findByText(/Multiplier successfully updated/i)
      .should('be.visible')
      .findByText(/Currency ratio successfully updated/i)
      .should('be.visible')
  })
})

describe('Banks & Cards Settings in Account Page', () => {
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

  it('should contains text Funding Source (Bank Account & Credit Card)', () => {
    cy.findAllByText(/Banks & Cards/i)
      .first()
      .click()
      .findByText('Funding Source (Bank Account & Credit Card)')
      .last()
      .should('be.visible')
  })

  it('should contains text Funding Source (Bank Account & Credit Card)', () => {
    cy.findAllByText(/Banks & Cards/i)
      .first()
      .click()
      .get('[data-cy=account-linked-unliked-btn]')
      .should('have.length', 96)
      .should('be.visible')
      .findAllByText('Linked')
      .should('have.length', 95)
      .should('be.visible')
      .findAllByText(/unlinked/i)
      .should('have.length', 1)
      .should('be.visible')
  })

  it('should toggle two-factor authentiication', () => {
    cy.fixture('user').as('usersJSON')
    cy.server()
    cy.route('POST', '/api/v1/user/two-factor-auth/status', {
      data: {message: 'two factor authentication has been deactivated'},
    })
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')

    cy.findAllByText(/security/i)
      .first()
      .click()
      .get('#twoFASwitch')
      .click({force: true})
      .get('.Toastify__toast-body', {timeout: 10000})
      .should('contain.text', 'Two-factor setting successfully updated')
      .should('be.visible')
      .should('be.visible')
  })

  it('should update when round-up investment is paused or resumed', () => {
    cy.fixture('user').as('usersJSON')
    cy.server()
    cy.route('POST', '/api/v1/user/two-factor-auth/status', {
      data: {message: 'two factor authentication has been deactivated'},
    })
    cy.route('POST', '/api/v1/user/notification/status', {
      data: {message: 'Notifications setting successfully updated'},
    })
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')

    cy.findAllByText(/security/i)
      .first()
      .click()
      .get('#notificationsSwitch')
      .click({force: true})
      .get('.Toastify__toast-body', {timeout: 10000})
      .should('contain.text', 'Notifications setting successfully updated')
      .should('be.visible')
      .should('be.visible')
  })
})

describe('Security Settings in Account Page', () => {
  beforeEach(() => {
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

  it('should contains text Two - Factor Authentication', () => {
    cy.findAllByText(/security/i)
      .first()
      .click()
      .findAllByText(/Two - Factor Authentication/i)
      .last()
      .should('be.visible')
  })

  it('should toggle two-factor authentiication', () => {
    cy.fixture('user').as('usersJSON')
    cy.server()
    cy.route('POST', '/api/v1/user/two-factor-auth/status', {
      data: {message: 'two factor authentication has been deactivated'},
    })
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')

    cy.findAllByText(/security/i)
      .first()
      .click()
      .get('#twoFASwitch')
      .click({force: true})
      .get('.Toastify__toast-body', {timeout: 10000})
      .should('contain.text', 'Two-factor setting successfully updated')
      .should('be.visible')
      .should('be.visible')
  })

  it('should update when round-up investment is paused or resumed', () => {
    cy.fixture('user').as('usersJSON')
    cy.server()
    cy.route('POST', '/api/v1/user/two-factor-auth/status', {
      data: {message: 'two factor authentication has been deactivated'},
    })
    cy.route('POST', '/api/v1/user/notification/status', {
      data: {message: 'Notifications setting successfully updated'},
    })
    cy.route('GET', '/api/v1/auth/me', '@usersJSON')

    cy.findAllByText(/security/i)
      .first()
      .click()
      .get('#notificationsSwitch')
      .click({force: true})
      .get('.Toastify__toast-body', {timeout: 10000})
      .should('contain.text', 'Notifications setting successfully updated')
      .should('be.visible')
      .should('be.visible')
  })
})

/* eslint-disable max-lines-per-function */
import {buildUser} from '../support/generator'
import 'cypress-file-upload'

describe('Register Page', () => {
  const user = cy
  const customer = buildUser()

  before(() => {
    user.fixture('countries').as('countriesJSON')
    user.server()
    user.route('GET', '/api/v1/data/countries', '@countriesJSON')

    user.visit('/account/signup')
  })

  it('greets with create an account and confirm your identity', () => {
    user
      .findAllByText(/create an account/i)
      .should('be.visible')
      .findAllByText(/confirm your identity/i)
      .should('be.visible')
  })

  it('contains U.S financial regulations requirements and next steps', () => {
    user
      .findByText(
        /U.S financial regulations require your identity to be verified./i,
      )
      .should('be.visible')
      .findByText(
        /after you link your bank account, you can start rounding up for crypto investment/i,
      )
      .should('be.visible')
  })

  it('links to /account/login', () => {
    user
      .findByText(/login here/i)
      .should('be.visible')
      .should('have.attr', 'href', '/account/login')
  })

  it('requires first name', () => {
    user
      .findAllByText(/create an account/i)
      .last()
      .click()
      .findByTestId('fname-error')
      .should('be.visible')
      .should('contain', `First Name is invalid`)
  })

  it('requires first name to be letters only', () => {
    user
      .findByLabelText(/first name/i)
      .click({force: true})
      .type('1233-:@:@:@:/.l67890')
      .blur()
      .findByTestId('fname-error')
      .should('be.visible')
      .should('contain', `First Name is invalid`)
  })

  it('requires last name', () => {
    user
      .findByLabelText(/first name/i)
      .click({force: true})
      .clear()
      .type('John')
      .findAllByText(/create an account/i)
      .first()
      .click()
      .findByTestId('lname-error')
      .should('be.visible')
      .should('contain', `Last Name is invalid`)
  })

  it('requires last name to be letters only', () => {
    user
      .findByLabelText(/last name/i)
      .click({force: true})
      .type('@[:;./:;::;:[1212323aza')
      .blur()
      .findByTestId('lname-error')
      .should('be.visible')
      .should('contain', `Last Name is invalid`)
  })

  it('requires email', () => {
    user
      .findByLabelText(/last name/i)
      .click({force: true})
      .clear()
      .type('Doe')
      .findAllByText(/create an account/i)
      .first()
      .click({force: true})
      .findByTestId('email-error')
      .should('be.visible')
      .should('contain', `Email is invalid`)
  })

  it('requires email to be valid email', () => {
    user
      .findByLabelText(/email/i)
      .type('1234@33#.cp', {force: true})
      .blur()
      .findByTestId('email-error')
      .should('be.visible')
      .should('contain', `Email is invalid`)
  })

  it('requires phone number', () => {
    user
      .findByLabelText(/email/i)
      .clear()
      .type('john.doe@gmail.com', {force: true})
      .findAllByText(/create an account/i)
      .first()
      .click({force: true})
      .findByTestId('phone-error')
      .should('be.visible')
      .should('contain', `Phone number is invalid`)
  })

  it('requires phone number to be valid numbers', () => {
    user
      .findByLabelText(/phone/i)
      .type('09987gk8797', {force: true})
      .blur()
      .findByTestId('phone-error')
      .should('be.visible')
      .should('contain', `Phone number is invalid`)
  })

  it('requires password', () => {
    user
      .findByLabelText(/phone/i)
      .clear()
      .type('09056458778', {force: true})
      .findAllByText(/create an account/i)
      .first()
      .click()
      .findAllByTestId('password-error')
      .should('be.visible')
      .should(
        'contain',
        `Password must contain at least 1 lowercase, 1 uppercase, 1 number and 8 characters`,
      )
  })

  it(`requires password to contain at least 1 lowercase, 1 uppercase, 
    1 number and 8 characters`, () => {
    user
      .findByLabelText('Password')
      .click({force: true})
      .type('weakpwd')
      .blur()
      .findAllByTestId('password-error')
      .should('be.visible')
      .should(
        'contain',
        `Password must contain at least 1 lowercase, 1 uppercase, 1 number and 8 characters`,
      )
  })

  it('requires confirm password', () => {
    user
      .findByLabelText('Password')
      .click({force: true})
      .clear()
      .type('Password1@')
      .findAllByText(/create an account/i)
      .first()
      .click()
      .findAllByTestId('password-error')
      .should('be.visible')
      .should('contain', `Passwords do not match`)
  })

  it(`requires confirm password to not match`, () => {
    user
      .findByLabelText('Confirm Password')
      .click({force: true})
      .type('Password')
      .findByLabelText('Password')
      .invoke('val')
      .then(password => {
        user
          .findByLabelText('Confirm Password')
          .should('not.have.value', password)
      })
      .blur()
      .findAllByTestId('password-error')
      .should('be.visible')
      .should('contain', `Passwords do not match`)
  })

  it('should have 04-07-1995 as date selected', () => {
    user
      .findByLabelText('Confirm Password')
      .click({force: true})
      .clear()
      .type('Password1@')
      .findByLabelText(/date of birth/i)
      .click({force: true})
      .get('.numInput')
      .type('1995')
      .get('.flatpickr-monthDropdown-months')
      .select('April')
      .get('[aria-label="April 7, 1995"]')
      .click()
      .get('#dob')
      .should('have.value', '04-07-1995')
  })

  it('requires street address', () => {
    user.findByTestId('address-error').should('contain', `Address is invalid`)
  })

  it('requires zip code', () => {
    user
      .findByLabelText(/street address/i)
      .type(customer.streetAddress, {force: true})
      .findByTestId('zip-error')
      .should('be.visible')
      .should('contain', `Zipcode is invalid`)
  })

  it('requires zip code to be valid', () => {
    user
      .findByLabelText(/zipcode/i)
      .click({force: true})
      .type('aw12-')
      .blur()
      .findByTestId('zip-error')
      .should('be.visible')
      .should('contain', `Zipcode is invalid`)
  })

  it('requires city', () => {
    user
      .findByLabelText(/zipcode/i)
      .click({force: true})
      .clear()
      .type(customer.zipcode)
      .findAllByText(/create an account/i)
      .last()
      .click()
      .findAllByText('Please select your city')
      .should('be.visible')
  })

  it('requires country', () => {
    user
      .findByLabelText(/choose your city/i)
      .click()
      .findByText('New York')
      .click()
      .findAllByText(/create an account/i)
      .last()
      .click()
      .findAllByText('Please select your country')
      .should('be.visible')
  })

  it('requires terms and conditions', () => {
    user
      .findByLabelText(/select your country/i)
      .click()
      .findByText('United States')
      .click()
      .findAllByText(/create an account/i)
      .last()
      .click()
      .findAllByText('Please agree to the terms and conditions')
      .should('be.visible')
  })

  it('it should not register user if email exist', () => {
    user.fixture('signup').as('signupJSON')
    user.server()
    user.route({
      method: 'POST',
      url: '/api/v1/auth/signup',
      status: 422,
      response: {
        data: {
          error: {email: ['The email has already been taken.']},
          code: 422,
        },
      },
    })

    user
      .findByLabelText(
        /Avenir’s Platform Agreement and Wyre’s Terms of Service and Privacy Policy/i,
      )
      .check({force: true})
      .findAllByText(/create an account/i)
      .last()
      .click()
      .findAllByText('The email has already been taken.')
      .should('be.visible')
  })

  it('should register a new user', () => {
    user.fixture('signup').as('signupJSON')
    user.fixture('signin').as('signinJSON')
    user.fixture('user').as('usersJSON')
    user.server()
    user.route('POST', '/api/v1/auth/signup', '@signupJSON')
    user.route('POST', '/api/v1/auth/signin', '@signinJSON')
    user.route('GET', '/api/v1/auth/me', '@usersJSON')

    user
      .findByLabelText(
        /Avenir’s Platform Agreement and Wyre’s Terms of Service and Privacy Policy/i,
      )
      .check({force: true})
      .findAllByText(/create an account/i)
      .last()
      .click()
      .url()
      .should('include', '/account/account-connect')
  })
})

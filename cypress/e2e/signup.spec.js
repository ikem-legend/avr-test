import subYears from 'date-fns/subYears'
import {buildUser} from '../support/generator'

describe('Register Page', () => {
  const user = cy
  beforeEach(() => {
    user.visit('/account/signup')
  })

  it('greets with create an account and confirm your identity', () => {
    user
      .findByText(/create an account/i)
      .should('be.visible')
      .findByText(/confirm your identity/i)
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
      .findByText(/sign up/i)
      .click()
      .findByTestId('fname-error')
      .should('be.visible')
      .should('contain', `First Name is invalid`)
  })

  it('requires first name to be letters only', () => {
    user
      .findByLabelText(/first name/i)
      .type('1233-:@:@:@:/.l67890')
      .blur()
      .findByTestId('fname-error')
      .should('be.visible')
      .should('contain', `First Name is invalid`)
  })

  it('requires last name', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('lname-error')
      .should('be.visible')
      .should('contain', `Last Name is invalid`)
  })

  it('requires first name to be letters only', () => {
    user
      .findByLabelText(/last name/i)
      .type('@[:;./:;::;:[1212323aza')
      .blur()
      .findByTestId('lname-error')
      .should('be.visible')
      .should('contain', `Last Name is invalid`)
  })

  it('requires phone number', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('phone-error')
      .should('be.visible')
      .should('contain', `Phone number is invalid`)
  })

  it('requires phone number to be valid numbers', () => {
    user
      .findByLabelText(/phone/i)
      .type('anemail@example.com')
      .blur()
      .findByTestId('phone-error')
      .should('be.visible')
      .should('contain', `Phone number is invalid`)
  })

  it('requires email', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('email-error')
      .should('be.visible')
      .should('contain', `Email is invalid`)
  })

  it('requires email to be valid email', () => {
    user
      .findByLabelText(/email/i)
      .type('1234@33#.cp')
      .blur()
      .findByTestId('email-error')
      .should('be.visible')
      .should('contain', `Email is invalid`)
  })

  it('requires password', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('password-error')
      .should('be.visible')
      .should(
        'contain',
        `Password must contain at least 1 lowercase, 1 uppercase, 1 number and 8 characters`,
      )
  })

  it(`requires password to contain at least 1 lowercase, 1 uppercase, 
    1 number and 8 characters`, () => {
    user
      .findByLabelText(/password/i)
      .type('weakpwd')
      .blur()
      .findByTestId('password-error')
      .should('be.visible')
      .should(
        'contain',
        `Password must contain at least 1 lowercase, 1 uppercase, 1 number and 8 characters`,
      )
  })

  it('requires social security number', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('ssn-error')
      .should('be.visible')
      .should('contain', `Social Security Number is invalid`)
  })

  it(`requires social security number to contain 9 characters`, () => {
    user
      .findByLabelText(/social security number/i)
      .type('012-34')
      .blur()
      .findByTestId('ssn-error')
      .should('be.visible')
      .should('contain', `Social Security Number is invalid`)
  })

  it('requires street address', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('address-error')
      .should('contain', `Address is invalid`)
  })

  it('requires zip code', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('zip-error')
      .should('be.visible')
      .should('contain', `Zipcode is invalid`)
  })

  it('requires zip code to be five numbers', () => {
    user
      .findByLabelText(/social security number/i)
      .type('aw12-')
      .blur()
      .findByTestId('zip-error')
      .should('be.visible')
      .should('contain', `Zipcode is invalid`)
  })

  it('requires city', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('city-error')
      .should('be.visible')
      .should('contain', `Please select a city`)
  })

  it('requires country', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('country-error')
      .should('be.visible')
      .should('contain', `This field is invalid`)
  })

  it('filters country by city selection', () => {
    user
      .findByLabelText(/choose your city/i)
      .click()
      .findByText(/london/i)
      .click()
      .findByLabelText(/select your country/i)
      .click()
      .findByText(/^united states$/i)
      .should('not.exist')
      .findByText(/united kingdom/i)
      .should('exist')
  })

  it('filters city by country selection', () => {
    user
      .findByLabelText(/select your country/i)
      .click()
      .findByText(/^united states$/i)
      .click()
      .findByLabelText(/choose your city/i)
      .click()
      .findByText(/london/i)
      .should('not.exist')
      .findByText(/texas/i)
      .should('exist')
  })

  it('requires terms and conditions', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('tandc-error')
      .should('be.visible')
      .should('contain', `Accept terms and conditions`)
  })

  it('should register a new user', () => {
    const customer = buildUser()

    user
      .findByLabelText(/first name/i)
      .type(customer.firstName)
      .findByLabelText(/last name/i)
      .type(customer.lastName)
      .findByLabelText(/phone/i)
      .type('07036975559')
      .findByLabelText(/date of birth/i)
      .click()
      .get('.numInput')
      .type('1995')
      .get('.flatpickr-monthDropdown-months')
      .select('April')
      .get('[aria-label="April 7, 1995"]')
      .click()
      .findByLabelText(/email/i)
      .type(customer.email)
      .findByLabelText(/password/i)
      .type(customer.password)
      .findByLabelText(/social security number/i)
      .type(customer.ssn)
      .findByLabelText(/street address/i)
      .type(customer.streetAddress)
      .findByLabelText(/zipcode/i)
      .type(customer.zipcode)
      .findByLabelText(/choose your city/i)
      .click()
      .findByText(/london/i)
      .click()
      .findByLabelText(/select your country/i)
      .click()
      .findByText(/united kingdom/i)
      .click()
      .findByLabelText(
        /Avenir’s Platform Agreement and Wyre’s Terms of Service and Privacy Policy/i,
      )
      .check({force: true})
      .findByText(/sign up/i)
      .click()
      .url()
      .should('include', '/account/account-connect')
  })
})

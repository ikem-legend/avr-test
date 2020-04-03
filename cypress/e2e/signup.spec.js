import subYears from 'date-fns/subYears'
import {buildUser} from '../support/generator'
import 'cypress-file-upload'

describe('Register Page', () => {
  const user = cy
  beforeEach(() => {
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
      .findByText(/sign up/i)
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
      .findByText(/sign up/i)
      .click()
      .findByTestId('lname-error')
      .should('be.visible')
      .should('contain', `Last Name is invalid`)
  })

  it('requires first name to be letters only', () => {
    user
      .findByLabelText(/last name/i)
      .click({force: true})
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
      .findByText(/sign up/i)
      .click()
      .findAllByTestId('password-error')
      .should('be.visible')
      .should('contain', `Passwords do not match`)
  })

  it(`requires confirm password to not match`, () => {
    user
      .findByLabelText('Password')
      .click({force: true})
      .type('Password1@#')
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

  it('requires image to be selected', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findAllByTestId('ssn-error')
      .should('be.visible')
      .should('contain', 'Please select image')
  })

  it('should have 07-Apr-1995 as date selected', () => {
    user
      .findByLabelText(/date of birth/i)
      .click({force: true})
      .get('.numInput')
      .type('1995')
      .get('.flatpickr-monthDropdown-months')
      .select('April')
      .get('[aria-label="April 7, 1995"]')
      .click()
      .get('#dob')
      .should('have.value', '07-Apr-1995')
  })

  it('requires street address', () => {
    user
      .findByText(/sign up/i)
      .click()
      .findByTestId('address-error')
      .should('contain', `Address is invalid`)
  })

  it('requires city', () => {
    const customer = buildUser()
    user
      .findByLabelText(/first name/i)
      .click({force: true})
      .type(customer.firstName)
      .findByLabelText(/last name/i)
      .click({force: true})
      .type(customer.lastName)
      .click({force: true})
      .findByLabelText(/email/i)
      .type(customer.email)
      .findByLabelText(/phone/i)
      .type('07036975559')
      .findByLabelText('Password')
      .click({force: true})
      .type('Password1')
      .findByLabelText('Confirm Password')
      .click({force: true})
      .type('Password1')
      .findByLabelText(/date of birth/i)
      .click({force: true})
      .get('.numInput')
      .type('1995')
      .get('.flatpickr-monthDropdown-months')
      .select('April')
      .get('[aria-label="April 7, 1995"]')
      .click({force: true})
      .fixture('logo.png')
      .then(fileContent => {
        cy.get('#userId').upload({
          fileContent,
          fileName: 'logo.png',
          mimeType: 'image/png',
        })
      })
      .findByLabelText(/street address/i)
      .click({force: true})
      .type(customer.streetAddress)
      .findByLabelText(/zipcode/i)
      .click({force: true})
      .type(customer.zipcode)
      .findByLabelText(
        /Avenir’s Platform Agreement and Wyre’s Terms of Service and Privacy Policy/i,
      )
      .check({force: true})
      .findByText(/sign up/i)
      .click()
      .findAllByText('Please select your city')
      .should('be.visible')
  })

  it('requires country', () => {
    const customer = buildUser()
    user
      .findByLabelText(/first name/i)
      .click({force: true})
      .type(customer.firstName)
      .findByLabelText(/last name/i)
      .click({force: true})
      .type(customer.lastName)
      .findByLabelText(/email/i)
      .type(customer.email)
      .findByLabelText(/phone/i)
      .type('07036975559')
      .findByLabelText('Password')
      .click({force: true})
      .type('Password1')
      .findByLabelText('Confirm Password')
      .click({force: true})
      .type('Password1')
      .findByLabelText(/date of birth/i)
      .click({force: true})
      .get('.numInput')
      .type('1995')
      .get('.flatpickr-monthDropdown-months')
      .select('April')
      .get('[aria-label="April 7, 1995"]')
      .click({force: true})
      .fixture('logo.png')
      .then(fileContent => {
        cy.get('#userId').upload({
          fileContent,
          fileName: 'logo.png',
          mimeType: 'image/png',
        })
      })
      .findByLabelText(/street address/i)
      .type(customer.streetAddress, {force: true})
      .findByLabelText(/choose your city/i)
      .click()
      .findByText('New York')
      .click()
      .findByLabelText(/zipcode/i)
      .click({force: true})
      .type(customer.zipcode)
      .findByLabelText(
        /Avenir’s Platform Agreement and Wyre’s Terms of Service and Privacy Policy/i,
      )
      .check({force: true})
      .findByText(/sign up/i)
      .click()
      .findAllByText('Please select your country')
      .should('be.visible')
  })

  it('requires zip code', () => {
    user
      .findByText(/sign up/i)
      .click()
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

  it('requires terms and conditions', () => {
    const customer = buildUser()

    user
      .findByLabelText(/first name/i)
      .click({force: true})
      .type(customer.firstName)
      .findByLabelText(/last name/i)
      .click({force: true})
      .type(customer.lastName)
      .findByLabelText(/email/i)
      .type(customer.email)
      .findByLabelText(/phone/i)
      .type('07036975559')
      .findByLabelText('Password')
      .click({force: true})
      .type('Password1')
      .findByLabelText('Confirm Password')
      .click({force: true})
      .type('Password1')
      .findByLabelText(/date of birth/i)
      .click({force: true})
      .get('.numInput')
      .type('1995')
      .get('.flatpickr-monthDropdown-months')
      .select('April')
      .get('[aria-label="April 7, 1995"]')
      .click()
      .fixture('logo.png')
      .then(fileContent => {
        cy.get('#userId').upload({
          fileContent,
          fileName: 'logo.png',
          mimeType: 'image/png',
        })
      })
      .findByLabelText(/street address/i)
      .type(customer.streetAddress, {force: true})
      .findByLabelText(/choose your city/i)
      .click()
      .findByText('New York')
      .click()
      .findByLabelText(/select your country/i)
      .click()
      .findByText('United States')
      .click()
      .findByLabelText(/zipcode/i)
      .click({force: true})
      .type(customer.zipcode)
      .findByText(/sign up/i)
      .click()
      .findAllByText('Please agree to the terms and conditions')
      .should('be.visible')
  })

  it('should register a new user', () => {
    const customer = buildUser()

    user
      .findByLabelText(/first name/i)
      .click({force: true})
      .type(customer.firstName)
      .findByLabelText(/last name/i)
      .click({force: true})
      .type(customer.lastName)
      .findByLabelText(/email/i)
      .type(customer.email)
      .findByLabelText(/phone/i)
      .type('07036975559')
      .findByLabelText('Password')
      .type('Password1', {force: true})
      .findByLabelText('Confirm Password')
      .click({force: true})
      .type('Password1')
      .findByLabelText(/date of birth/i)
      .click({force: true})
      .get('.numInput')
      .type('1995')
      .get('.flatpickr-monthDropdown-months')
      .select('April')
      .get('[aria-label="April 7, 1995"]')
      .click()
      .fixture('logo.png')
      .then(fileContent => {
        cy.get('#userId').upload({
          fileContent,
          fileName: 'logo.png',
          mimeType: 'image/png',
        })
      })
      .findByLabelText(/street address/i)
      .type(customer.streetAddress, {force: true})
      .findByLabelText(/choose your city/i)
      .click()
      .findByText('New York')
      .click()
      .findByLabelText(/select your country/i)
      .click()
      .findByText('United States')
      .click()
      .findByLabelText(/zipcode/i)
      .click({force: true})
      .type(customer.zipcode)
      .findByLabelText(
        /Avenir’s Platform Agreement and Wyre’s Terms of Service and Privacy Policy/i,
      )
      .check({force: true})
      .findByText(/sign up/i)
      .click()
      .wait(20000)
      .url()
      .should('include', '/account/account-connect')
  })
})

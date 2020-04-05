describe('Login Page', () => {
  const user = cy
  beforeEach(() => {
    user.visit('/account/login')
  })

  it('greets with welcome back', () => {
    user.findByText(/welcome back!/i).should('be.visible')
  })

  it('links to /account/forgot-password', () => {
    user
      .findByText(/forgot password/i)
      .should('be.visible')
      .should('have.attr', 'href', '/account/forgot-password')
  })

  it('links to /account/signup', () => {
    user
      .findByText(/sign up/i)
      .should('be.visible')
      .should('have.attr', 'href', '/account/signup')
  })

  it('links to /account/customer-support', () => {
    user
      .findByText(/contact/i)
      .should('be.visible')
      .should('have.attr', 'href', '/account/customer-support')
  })

  it('requires email', () => {
    user
      .findByText(/login/i)
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
      .findByText(/login/i)
      .click()
      .findByTestId('password-error')
      .should('be.visible')
      .should('contain', `This field is invalid`)
  })

  it('requires correct email and password combination', () => {
    user
      .findByLabelText(/email/i)
      .type('frank@ocean.com')
      .findByLabelText(/password/i)
      .type('wrongpwd')
      .findByText(/login/i)
      .click()
      .findByRole('alert')
      .should('be.visible')
      .should('contain', `Invalid email or password`)
  })

  it('should login a user', () => {
    user.fixture('signin').as('signinJSON')
    user.fixture('user').as('usersJSON')
    user.server()
    user.route('POST', '/api/v1/auth/signin', '@signinJSON')
    user.route('GET', '/api/v1/auth/me', '@usersJSON')

    user
      .findByLabelText(/email/i)
      .type('a.phillip@gmail.com')
      .findByLabelText(/password/i)
      .type('Password@1')
      .findByText(/login/i)
      .click()
      .assertHome()
      .getCookie('avenirUser')
      .should('have.property', 'value')
      .url()
      .should('include', '/dashboard')
  })
})

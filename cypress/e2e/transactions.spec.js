describe('Transactions Page', () => {
  const user = cy
  beforeEach(() => {
    user.login()
    user.visit('/transactions')
  })

  it.only('greets with avenir rounds up your everyday credit card', () => {
    user
      .findByText(
        /Avenir rounds up your everyday credit card purchases to the nearest dollar and invests the nearest cents/i,
      )
      .should('be.visible')
  })

  it.only('tops up a user investment', () => {
    user.findByPlaceholderText(/enter amount/i).type(10)
    user
      .findByText(/invest now/i)
      .click()
      .findByRole('alert')
      .should('be.visible')
      .should('contain', `Top-up made successfully`)
  })
})

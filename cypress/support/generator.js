import {build, fake} from '@jackfranklin/test-data-bot'

const buildUser = build('User', {
  fields: {
    firstName: fake(f => f.name.firstName()),
    lastName: fake(f => f.name.lastName()),
    phone: fake(f => f.phone.phoneNumberFormat()),
    email: fake(f => f.internet.email()),
    password: fake(f => f.internet.password()),
    ssn: fake(f => f.phone.phoneNumber('##########')),
    streetAddress: fake(f => f.address.streetAddress()),
    zipcode: fake(f => f.address.zipCode()),
  },
})

export {buildUser}

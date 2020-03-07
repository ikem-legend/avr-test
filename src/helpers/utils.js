export const toFormData = values => {
  const formData = new FormData()
  Object.keys(values).forEach(key => {
    formData.append(key, values[key])
  })
  for (var pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1])
  }
  return formData
}

export const toFormData = values => {
  const formData = new FormData()
  Object.keys(values).forEach(key => {
    formData.append(key, values[key])
  })
 //  for (const pair of formData.entries()) {
 //    console.log(pair[0]+ ', ' + pair[1]);
	// }
  return formData
}

export const numberWithCommas = x =>
  x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
import Pica from 'pica'

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

export function resizeImage(file, body) {
  const pica = Pica()

  const outputCanvas = document.createElement('canvas')
  outputCanvas.height = 480
  outputCanvas.width = 640

  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      resolve(
        pica
          .resize(img, outputCanvas, {
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2,
          })
          .then(result => pica.toBlob(result, 'image/jpeg', 0.8)),
      )
    }

    img.src = `data:${file.type};base64,${body}`
  })
}

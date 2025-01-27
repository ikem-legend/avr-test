import Pica from 'pica'

/**
 * Convert image to form data
 * @param {object} values Image
 * @returns {object} Form data
 */
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

/**
 * Number with commas
 * @param {number} x Number
 * @returns {string} Number formatted with commas
 */
export const numberWithCommas = x =>
  x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''

/**
 * Resize image
 * @param {file} file Image file details
 * @param {object} body Image body details
 * @returns {Promise} Resized image
 */
export function resizeImage(file, body) {
  const pica = new Pica()

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

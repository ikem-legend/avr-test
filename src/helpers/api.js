import axios from 'axios'
/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 * @return response
 */

const config = {
  fetchUrl: 'https://myavenir.herokuapp.com/api/v1',
}

const callPlainApi = (url, data, method) =>
  new Promise((resolve, reject) => {
    const axiosOptions = {
      timeout: 15000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
    if (method === 'PUT') {
      axios
        .put(`${config.fetchUrl}${url}`, data, {...axiosOptions})
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    }
    if (method === 'POST') {
      axios
        .post(`${config.fetchUrl}${url}`, data, axiosOptions)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    } else {
      axios
        .get(`${config.fetchUrl}${url}`, {...axiosOptions})
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    }
  })

const callSecuredApi = (url, data, method, token, callback) => {
  const axiosOptions = {}
  if (token) {
    axiosOptions.headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    axiosOptions.timeout = 15000
  }
  return new Promise((resolve, reject) => {
    if (method === 'PUT') {
      axiosOptions.method = 'PUT'
      axiosOptions.body = data
      axios
        .put(`${config.fetchUrl}${url}`, data, {
          headers: axiosOptions.headers,
          timeout: axiosOptions.timeout,
        })
        .then(response => {
          if (callback) {
            callback()
          }
          console.log(response)
          resolve(response.data)
        })
        .catch(err => {
          if (err.response && err.response.status === 403) {
            reject('You are not authorized to perform this action')
          }
          if (err.response && err.response.status === 401) {
            reject("You've been logged out, log in to continue.")
          }
          reject(err)
        })
    } else if (method === 'POST') {
      axios
        .post(`${config.fetchUrl}${url}`, data, {
          headers: axiosOptions.headers,
          timeout: axiosOptions.timeout,
        })
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          console.log(err)
          if (err.response && err.response.status === 403) {
            reject('You are not authorized to perform this action')
          }
          if (err.response && err.response.status === 401) {
            reject("You've been logged out, log in to continue.")
          }
          if (err.response && err.response.data) {
            reject(err.response.data)
          }
          if (err.response && err.response.status) {
            reject(err.response.status)
          }
        })
    } else if (method === 'PATCH') {
      axios
        .patch(`${config.fetchUrl}${url}`, data, {
          headers: axiosOptions.headers,
          timeout: axiosOptions.timeout,
        })
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          if (err.response && err.response.status === 403) {
            reject('You are not authorized to perform this action')
          }
          if (err.response && err.response.status === 401) {
            reject("You've been logged out, log in to continue.")
          }
          if (err.response.data) {
            reject(err.response.data)
          }
          reject(err.response.status)
        })
    } else if (method === 'DELETE') {
      axios
        .delete(`${config.fetchUrl}${url}`, {
          headers: axiosOptions.headers,
          timeout: axiosOptions.timeout,
        })
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          if (err.response && err.response.status === 403) {
            reject('You are not authorized to perform this action')
          }
          if (err.response && err.response.status === 401) {
            reject("You've been logged out, log in to continue.")
          }
          if (err.response.data) {
            reject(err.response.data)
          }
          reject(err.response.status)
        })
    } else {
      axios
        .get(`${config.fetchUrl}${url}`, {
          headers: axiosOptions.headers,
          timeout: axiosOptions.timeout,
        })
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          if (err.response && err.response.status === 403) {
            reject('You are not authorized to perform this action')
          }
          if (err.response && err.response.status === 401) {
            reject("You've been logged out, log in to continue.")
          }
          reject(err)
        })
    }
  })
}

const callApi = (url, data, method, token, callback) => {
  if (token) {
    return callSecuredApi(url, data, method, token, callback)
  }
  return callPlainApi(url, data, method, callback)
}

export {config, callApi}

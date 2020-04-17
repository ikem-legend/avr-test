import axios from 'axios'
/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 * @return response
 */

const config = {
  fetchUrl: 'https://avenir-test.herokuapp.com/api/v1',
  // fetchUrl: 'https://avenir-backend.herokuapp.com/api/v1',
  // fetchUrl: 'https://myavenir.herokuapp.com/api/v1',
}

const callPlainApi = (url, data, method) =>
  new Promise((resolve, reject) => {
    const axiosOptions = {
      timeout: 30000,
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
          if (err.response && err.response.data && err.response.data.data) {
            return reject(err.response.data.data.error)
          }
          return reject(err)
        })
    } else {
      axios
        .get(`${config.fetchUrl}${url}`, {...axiosOptions})
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
          if (err.response && err.response.data && err.response.data.data) {
            return reject(err.response.data.data.error)
          }
          return reject(err)
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
    axiosOptions.timeout = 30000
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
          if (err.response && err.response.data && err.response.data.data) {
            return reject(err.response.data.data.error)
          }
          return reject(err)
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
          if (err.response && err.response.data && err.response.data.data) {
            reject(err.response.data.data.error)
          }
          reject(err)
        })
    }
  })
}

const callExternalApi = (url, data, method) =>
  new Promise((resolve, reject) => {
    const axiosOptions = {
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
    if (method === 'PUT') {
      axios
        .put(`${url}`, data, {...axiosOptions})
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    }
    if (method === 'POST') {
      axios
        .post(`${url}`, data, axiosOptions)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    } else {
      axios
        .get(`${url}`, {...axiosOptions})
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    }
  })

const callApi = (url, data, method, token, callback) => {
  if (token) {
    return callSecuredApi(url, data, method, token, callback)
  }
  if (/https/.test(url)) {
    return callExternalApi(url, data, method, callback)
  }
  return callPlainApi(url, data, method, callback)
}

export {config, callApi}

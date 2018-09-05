export default class GSheet {
  constructor () {
    this._token = ''
  }

  _fetch ({
    url,
    method = 'GET',
    body
  }) {
    url = 'https://content-sheets.googleapis.com/v4/spreadsheets' + url

    const params = {
      method,
      headers: {
        'Authorization': 'Bearer ' + this._token,
        'Content-Type': 'application/json'
      }
    }

    if (body) {
      params.body = JSON.stringify(body)
    }

    let status = 0
    return new Promise((resolve, reject) => {
      window.fetch(url, params)
        .then(rsp => {
          status = rsp.status
          switch (status) {
            case 200:
              return rsp.json()
            case 204:
              return null
            case 500:
              return {
                message: 'Internal server error.'
              }
            default:
              return {
                message: rsp.statusText
              }
          }
        })
        .then(body => {
          if (status === 200) {
            resolve(body)
          }
        })
    })
  }

  getAuthToken () {
    return new Promise((resolve, reject) => {
      window.chrome.identity.getAuthToken({
        'interactive': true
      }, token => {
        this._token = token
        resolve()
      })
    })
  }

  writeToSheet ({
    spreadsheetId,
    range,
    values
  }) {
    const url = `/${spreadsheetId}/values/${encodeURIComponent(range)}:append?insertDataOption=OVERWRITE&valueInputOption=RAW&alt=json`
    return this._fetch({
      url,
      method: 'POST',
      body: {
        range,
        values,
        'majorDimension': 'ROWS'
      }
    })
  }

  createSheet (params) {
    return this._fetch({
      url: '/',
      method: 'POST',
      body: params
    })
  }
}

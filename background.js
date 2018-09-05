/**
 * Google Sheet API
 */
const G_SHEET = (() => {
  let _token = ''

  const _fetch = ({
    url,
    method = 'GET',
    body
  }) => {
    url = 'https://content-sheets.googleapis.com/v4/spreadsheets' + url

    const params = {
      method,
      headers: {
        'Authorization': 'Bearer ' + _token,
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

  const getAuthToken = () => {
    return new Promise((resolve, reject) => {
      window.chrome.identity.getAuthToken({
        'interactive': true
      }, token => {
        _token = token
        resolve()
      })
    })
  }

  const writeToSheet = ({
    spreadsheetId,
    range,
    values
  }) => {
    const url = `/${spreadsheetId}/values/${encodeURIComponent(range)}:append?insertDataOption=OVERWRITE&valueInputOption=RAW&alt=json`
    return _fetch({
      url,
      method: 'POST',
      body: {
        range,
        values,
        'majorDimension': 'ROWS'
      }
    })
  }

  const createSheet = params => {
    return _fetch({
      url: '/',
      method: 'POST',
      body: params
    })
  }

  return {
    getAuthToken,
    createSheet,
    writeToSheet
  }
})()

const {
  getAuthToken,
  createSheet,
  writeToSheet
} = G_SHEET

// https://jira.garenanow.com/rest/api/2/search?jql=
// project = SPDGT
// AND issuetype IN ("Task", "Sub-task")
// AND resolution IN ("Unresolved", "Done")
// AND component IN ("FE","BE")
// AND status IN ("To Do", "In Progress", "Closed")
// AND assignee IN ("qian.wei@shopee.com")
window.chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  window.fetch(request.searchUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (myJson) {
      var result = []
      if (myJson.issues && myJson.issues.length) {
        myJson.issues.forEach(function (item) {
          var obj = {
            key: item.key,
            link: item.self,
            description: item.fields.description || '',
            assignee: item.fields.assignee.name || ''
          }
          result.push(obj)
        })
      }
      window.alert(JSON.stringify(result))
      console.log(JSON.stringify(result))
    })
})

import { tFormat } from '/utils.js'
import GSheet from './gsheet.js'

const gSheet = new GSheet()

// https://jira.garenanow.com/rest/api/2/search?jql=
// project = SPDGT
// AND issuetype IN ("Task", "Sub-task")
// AND resolution IN ("Unresolved", "Done")
// AND component IN ("FE","BE")
// AND status IN ("To Do", "In Progress", "Closed")
// AND assignee IN ("qian.wei@shopee.com")
window.chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('background.js------', request.searchUrl)
  window.fetch(request.searchUrl)
    .then(function (response) {
      if (response.status === 200) {
        return response.json()
      } else if ([400, 401].indexOf(response.status) > -1) {
        window.alert('您还没登陆jira呦～去登陆')
        window.chrome.tabs.create({ url: 'https://jira.garenanow.com/secure/Dashboard.jspa' })
      }
    })
    .then(function (myJson) {
      var result = [['url', 'summary', 'description', 'assignee', 'reporter', 'created']]
      if (myJson.issues && myJson.issues.length) {
        myJson.issues.forEach(function (item) {
          const {
            key,
            fields: {
              summary,
              description,
              assignee,
              created,
              reporter
            }
          } = item

          var arr = [
            'https://jira.garenanow.com/browse/' + key,
            summary,
            description || '',
            (assignee && assignee.name) || '',
            (reporter && reporter.name) || '',
            created
          ]
          result.push(arr)
        })
      }
      window.alert(result)
      generateSheet(result)
    }).catch(function (err) {
      console.log(err)
    })
})

function generateSheet (data) {
  const title = tFormat('YYYY-MM-DD hh:mm:ss')
  gSheet.getAuthToken()
    .then(() => {
      gSheet.createSheet({
        'properties': {
          title
        }
      })
        .then(res => {
          const { spreadsheetId } = res
          gSheet.writeToSheet({
            spreadsheetId,
            range: 'Sheet1!A1:A',
            values: data
          })
        })
    })
}

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
  window.fetch(request.searchUrl)
    .then(function (response) {
      return response.json()
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
            assignee.name || '',
            reporter.name || '',
            created
          ]
          result.push(arr)
        })
      }
      generateSheet(result)
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

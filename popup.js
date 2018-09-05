// https://jira.garenanow.com/rest/api/2/search?jql=
// project IN ('SPDGT')
// AND issuetype IN ('Task', 'Sub-task')
// AND resolution IN ('Unresolved', 'Done')
// AND component IN ('FE','BE')
// AND status IN ('To Do', 'In Progress', 'Closed')
// AND assignee IN ('qian.wei@shopee.com')
var jiraBox = document.getElementById('jiraBox')
var selectBox = document.getElementById('selectBox')
var initArgs = {
  project: ['SPDGT'],
  issuetype: ['Task', 'Sub-task'],
  // resolution: ['Unresolved', 'Done'],
  component: ['FE'],
  // status: ['To Do', 'In Progress', 'Closed', 'Waiting'],
  assignee: []
}
var currentUser = []

window.fetch('https://jira.garenanow.com/rest/auth/1/session')
  .then(function (response) {
    return response.json()
  })
  .then(function (myJson) {
    if (myJson && myJson.name) {
      currentUser = [myJson.name]
      initArgs.assignee = currentUser
    }
  })

var searchArgs = {}
var originUrl = `https://jira.garenanow.com/rest/api/2/search?jql=
  project IN {project}
  AND issuetype IN {issuetype}
  AND component IN  {component}
  {assignee}`

// AND resolution IN {resolution}
// AND status IN {status}

jiraBox.addEventListener('click', function (e) {
  if (e && e.target && e.target.dataset && e.target.dataset.type) {
    var queryType = e.target.dataset.type
    var selectDom = selectBox.getElementsByTagName('ul')
    var panelObj = {}
    for (var i = 0; i < selectDom.length; i++) {
      var ul = selectDom[i]
      var inputDom = ul.getElementsByTagName('input')
      var tempkey = ''
      var templist = []
      var selectFlag = false
      var inputNameFlag = false
      for (var j = 0; j < inputDom.length; j++) {
        var item = inputDom[j]
        tempkey = item.name
        if (tempkey === 'assignee') {
          if (item.checked) {
            selectFlag = true
          } else if (item.value) {
            inputNameFlag = true
            initArgs[tempkey] = item.value.split(';').map(function (item) {
              if (item.indexOf('@shopee.com') > -1) {
                return item
              } else {
                return item + '@shopee.com'
              }
            })
          } else if (!selectFlag && !inputNameFlag) {
            initArgs[tempkey] = currentUser
          }
        } else if (item.checked) {
          panelObj[tempkey] = []
          panelObj[tempkey].push(item.value)
          selectFlag = true
          templist.push(item.value)
        }
      }
      if (selectFlag) {
        if (tempkey === 'assignee') {
          initArgs[tempkey] = []
        } else {
          initArgs[tempkey] = templist
        }
      }
    }
    for (var key in initArgs) {
      searchArgs[key] = '("' + initArgs[key].join('","') + '")'
    }
    var searchUrl = originUrl.replace('{project}', searchArgs.project)
      .replace('{issuetype}', searchArgs.issuetype)
      .replace('{resolution}', searchArgs.resolution)
      .replace('{component}', searchArgs.component)
      .replace('{status}', searchArgs.status)
      .replace('{assignee}', initArgs.assignee.length > 0 ? ('AND assignee IN ' + searchArgs.assignee) : '')
    console.log(searchUrl, searchUrl)
    window.chrome.runtime.sendMessage({
      action: queryType,
      searchUrl: searchUrl
    })
  } else if (e && e.target && e.target.dataset && e.target.dataset.url) {
    window.chrome.tabs.create({ url: e.target.dataset.url })
  }
})

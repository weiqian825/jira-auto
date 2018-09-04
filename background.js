// https://jira.garenanow.com/rest/api/2/search?jql= 
// project = SPDGT 
// AND issuetype IN ("Task", "Sub-task") 
// AND resolution IN ("Unresolved", "Done") 
// AND component IN ("FE","BE") 
// AND status IN ("To Do", "In Progress", "Closed") 
// AND assignee IN ("qian.wei@shopee.com")

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
   window.fetch(request.searchUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      var result  = []
      if(myJson.issues && myJson.issues.length){
        myJson.issues.forEach(function(item){
            var obj = {
                key: item.key,
                link: item.self,
                description: item.fields.description||"",
                assignee:item.fields.assignee.name||""
            }
            result.push(obj)
        })
      }
      alert(JSON.stringify(result))
      console.log(JSON.stringify(result));
    });
})





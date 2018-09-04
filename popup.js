// https://jira.garenanow.com/rest/api/2/search?jql= 
// project IN ("SPDGT")
// AND issuetype IN ("Task", "Sub-task") 
// AND resolution IN ("Unresolved", "Done") 
// AND component IN ("FE","BE") 
// AND status IN ("To Do", "In Progress", "Closed") 
// AND assignee IN ("qian.wei@shopee.com")
var jiraBox = document.getElementById("jiraBox")
var selectBox = document.getElementById("selectBox")
var initArgs = {
    project: ["SPDGT"],
    issuetype: ["Task", "Sub-task"],
    resolution: ["Unresolved", "Done"],
    component: ["FE","BE"],
    status: ["To Do", "In Progress", "Closed"],
    assignee: ["qian.wei@shopee.com"]
} 
var searchArgs = {}   
var originUrl = 'https://jira.garenanow.com/rest/api/2/search?jql=\
                    project IN {project} \
                    AND issuetype IN {issuetype}\
                    AND resolution IN {resolution}\
                    AND component IN  {component}\
                    AND status IN {status}\
                    AND assignee IN {assignee}';

jiraBox.addEventListener('click', function(e){
    if(e && e.target && e.target.dataset &&e.target.dataset.type){
        
        var queryType = e.target.dataset.type
        var selectDom = selectBox.getElementsByTagName('ul')
        for(var i=0;i<selectDom.length;i++){
            var ul = selectDom[i]
            var inputDom = ul.getElementsByTagName('input')
            var tempkey = '';
            var templist = [];
            var selectFlag = false
            for(var j=0;j<inputDom.length;j++){
                var item = inputDom[j]
                tempkey = item.name;
                if(item.checked){
                    selectFlag = true;
                    templist.push(item.value);
                }
            }
            if(selectFlag){
                initArgs[tempkey] = templist
            }
        }
        for(key in initArgs){
            searchArgs[key] = '("' + initArgs[key].join('","') + '")'
        }
        var searchUrl = originUrl.replace("{project}",searchArgs.project)
                                 .replace("{issuetype}",searchArgs.issuetype)
                                 .replace("{resolution}",searchArgs.resolution)
                                 .replace("{component}",searchArgs.component)
                                 .replace("{status}",searchArgs.status)
                                 .replace("{assignee}",searchArgs.assignee)

        chrome.runtime.sendMessage({
            action: queryType,
            searchUrl: searchUrl
        }, function(){});
    }else{
        location.href = "https://drive.google.com/drive/u/0/my-drive"
    }
});
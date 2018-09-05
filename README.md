Jira Auto 插件教程

1. 获取插件[代码](https://github.com/weiqian93/jira-auto.git)
2. 获取插件 id
    打开[chrome插件](chrome://extensions/) 
    点击加载已解压的拓展程序，选择jira_auto整个目录，得到插件的id
3. 添加 google sheet api 库
   打开[Dashboard](https://console.developers.google.com/)
   输入 google sheet api => MANAGE
4. 修改 client id
    打开[credentials](https://console.developers.google.com/apis/credentials) 
    Credentials => Create Credentials => oAuth Client Id => Chrome App
    将第一步得到的 id 复制到 Application ID 一栏，点击创建得到 client ID
5. 将得到的 client id 拷贝下来覆盖掉项目下 manifest.json 中的 client_id 字段，然后刷新插件，接着就可以愉快的使用了。


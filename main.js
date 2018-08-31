const electron = require('electron')
const url = require('url')
const path = require('path')
const shell = require('shelljs')
const exec = require('child_process').exec
const spawn = require('child_process').spawn
// https://github.com/electron-userland/electron-packager/issues/603
const fixPath = require('fix-path')
const fs = require('fs')
fixPath()

const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = electron
let mainWindow

// method 1: try use shelljs ---error
ipcMain.on('shelljs:querybtn', function (e, command) {
  mainWindow.webContents.send('shelljs:querybtn', command)
  // need execPath /usr/local/bin/node ?
  // // https://github.com/shelljs/shelljs/issues/704
  // shell.config.execPath = shell.which('node').stdout
  // shell.config.execPath = process.env.PATH
  console.log('shelljs command---> ', command)
  shell.exec(command)
})

// method 2: try use child_process  exec
ipcMain.on('exec:querybtn', function (e, command) {
  console.log('exec command---> ', command)
  mainWindow.webContents.send('exec:querybtn', '进入函数：exec')
  exec(__dirname + '/' + command, (error, stdout, stderr) => {
    console.log('执行结束：exec')
    mainWindow.webContents.send('exec:querybtn', '结束执行', error, stdout, stderr)
    error && console.log('error', error)
    stdout && console.log('stdout', stdout)
    stderr && console.log('stderr', stderr)
  })
})

// method 3: try use child_process  spawn
ipcMain.on('spawn:querybtn', function (e, command) {
  console.log('spawn command---> ', command)
  const _process = spawn(__dirname + '/' + command[0], command[1])
  mainWindow.webContents.send('spawn:querybtn', '进入函数：spawn')

  _process.stdout.on('data', function (data) {
    console.log(' stdout 执行结束：spawn')
    mainWindow.webContents.send('spawn:querybtn', '结束执行', data)
    console.log(data.toString())
  })

  _process.stderr.on('data', function (data) {
    console.log('stderr 执行结束：spawn')
    mainWindow.webContents.send('spawn:querybtn', '结束执行', data)
    console.log(data.toString())
  })
})

app.on('ready', function () {
  mainWindow = new BrowserWindow({})
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file',
    slashes: true
  }))
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)

  setTimeout(function () {
    mainWindow.webContents.send('jira-auto', __dirname)
    if (fs.existsSync(__dirname + '/./jira-auto')) {
      mainWindow.webContents.send('jira-auto', '文件存在')
    }
  }, 1000)
})

const mainMenuTemplate = [{
  label: 'Application',
  submenu: [{
    label: 'Quit',
    accelerator: 'Command+Q',
    click: function () {
      app.quit()
    }
  }]
}]

if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({
    label: 'Edit',
    submenu: [{
      role: 'undo'
    }, {
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      role: 'cut'
    }, {
      role: 'copy'
    }, {
      role: 'paste'
    }, {
      role: 'pasteandmatchstyle'
    }, {
      role: 'delete'
    }, {
      role: 'selectall'
    }]
  })
}

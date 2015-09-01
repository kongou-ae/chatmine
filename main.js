'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');

var http = require('http');
var setup = require('proxy');
var server = setup(http.createServer());

// アプリケーションメニュー設定
var menu = Menu.buildFromTemplate([
  {
    label: 'Main',
    submenu: [
      {label: 'About'},
      {label: 'Exit', click: function() { app.quit(); }}
    ]
  },
  {
    label: 'Setting',
    submenu: [
      {label: 'Redmine Settings'},
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {label: 'Copy', accelerator: 'Command+C', selector: 'copy'},
      {label: 'Paste', accelerator: 'Command+V', selector: 'paste'}
    ]
  },
  {    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'Command+R', click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); } },
      { label: 'Toggle DevTools', accelerator: 'Alt+Command+I', click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); } }
    ]
  }
]);

Menu.setApplicationMenu(menu);

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {

  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({width: 1000, height: 650,'node-integration': false});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  server.listen(3128, function () {
    var port = server.address().port;
    console.log('HTTP(s) proxy server listening on port %d', port);
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});


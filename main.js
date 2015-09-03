'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var cors_proxy = require('cors-anywhere');


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

  var host = '127.0.0.1';
  var port = 8080;

  cors_proxy.createServer({
      originWhitelist: [], // Allow all origins
      //requireHeader: ['origin', 'x-requested-with'],
      removeHeaders: ['cookie', 'cookie2']
  }).listen(port, host, function() {
      console.log('Running CORS Anywhere on ' + host + ':' + port);
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

var gulp = require('gulp');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var install = require('gulp-install');
var packageJson = require('./package.json');
var packager = require('electron-packager');
var del = require('del');
var zip = require('gulp-zip');


gulp.task('copyJs', function() {
  return gulp.src(['js/*'])
    .pipe(gulp.dest('src/js/'));
});

gulp.task('copyView', function() {
  return gulp.src(['view/*'])
    .pipe(gulp.dest('src/view/'));
});

gulp.task('copyFile', function() {
  return gulp.src(['index.html','main.js','package.json'])
    .pipe(gulp.dest('src/'));
});


gulp.task('moduleInstall', function() {
  return gulp.src('src/package.json')
    .pipe(gulp.dest('src/'))
    .pipe(install({production: true}));
});


gulp.task('electron-package', function (done) {
  packager({
    dir: 'src',              // アプリケーションのパッケージとなるディレクトリ
    out: 'release/',    // .app や .exeの出力先ディレクトリ
    name: packageJson.name,      // アプリケーション名
    arch: 'all',              // CPU種別. x64 or ia32
    platform: 'win32',       // OS種別. darwin or win32 or linux
    version: '0.30.0',         // Electronのversion
    overwrite: 'true'
  }, function (err, path) {
    // 追加でパッケージに手を加えたければ, path配下を適宜いじる
    done();
  });
});

gulp.task('clean', function(cb) {
  del(['./src','./release'], cb);
});

gulp.task('zip32', function() {
  return gulp.src('./release/'+packageJson.name+'-win32-ia32/*')
    .pipe(zip(packageJson.name+'-win32-ia32.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('zip64', function() {
  return gulp.src('./release/'+packageJson.name+'-win32-x64/*')
    .pipe(zip(packageJson.name+'-win32-x64.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('deploy', function(callback) {
  return runSequence(
    ['copyJs','copyView','copyFile'], // ソースをビルド用ディレクトリにコピー
    ['moduleInstall'], //ビルド用ディレクトリにnode_moduleをインストール
    ['electron-package'], // パッケージ作成
    ['zip32'],//パッケージをzip化
    ['zip64'],//パッケージをzip化
    ['clean'], //srcディレクトリを削除
    // パッケージをzip化
    callback
  );
});
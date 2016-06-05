var gulp = require('gulp');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var install = require('gulp-install');
var packageJson = require('./package.json');
var packager = require('electron-packager');
var del = require('del');
var archiver = require('gulp-archiver');
var electron = require('electron-connect').server.create();


gulp.task('copyJs', function() {
  return gulp.src(['js/*'])
    .pipe(gulp.dest('src/js/'));
});

gulp.task('copyCss', function() {
  return gulp.src(['css/*'])
    .pipe(gulp.dest('src/css/'));
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
    dir: './src',              // アプリケーションのパッケージとなるディレクトリ
    out: './dist',    // .app や .exeの出力先ディレクトリ
    cache: './cache',
    name: packageJson.name,      // アプリケーション名
    arch: 'all',              // CPU種別. x64 or ia32
    platform: 'win32',       // OS種別. darwin or win32 or linux
    version: '0.30.0',         // Electronのversion
    overwrite: true,
    rebuild: true,

  }, function (err, path) {
    // 追加でパッケージに手を加えたければ, path配下を適宜いじる
    done();
  });
});

gulp.task('clean', function(cb) {
//  del(['./src/*','./dist/*'], cb);
  del(['./src/*'], cb);
});

gulp.task('zip32', function() {
  return gulp.src(['dist/'+packageJson.name+'-win32-ia32/**'])
    .pipe(archiver(packageJson.name+'-win32-ia32.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('zip64', function() {
  return gulp.src('dist/'+packageJson.name+'-win32-x64/**')
    .pipe(archiver(packageJson.name+'-win32-x64.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('deploy', function(callback) {
  return runSequence(
    ['copyJs','copyCss','copyFile'], // ソースをビルド用ディレクトリにコピー
    ['moduleInstall'], //ビルド用ディレクトリにnode_moduleをインストール
    ['electron-package'], // パッケージ作成
    ['zip32'],//パッケージをzip化
    ['zip64'],//パッケージをzip化
    ['clean'], //srcディレクトリを削除
    // パッケージをzip化
    callback
  );
});

gulp.task('server',function () {
    // Start browser process
    electron.start();

    // Restart browser process
    gulp.watch('./main.js', electron.restart);

    // Reload renderer process
    gulp.watch(['./js/*.js'], electron.reload);
})

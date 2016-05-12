'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    gulpSequence = require('gulp-sequence'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    ngTemplate = require('gulp-ng-template'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    replace = require('gulp-replace'),
    usemin = require('gulp-usemin'),
    merge2 = require('merge2'),
    version = 'v' + require('./package.json').version;

gulp.task('clean', function () {
    return gulp.src(['dist/*'])
        .pipe(clean({force: true}));
});

gulp.task('jshint', function () {
    return gulp.src(['www/js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('css', function () {
    return gulp.src([
        'www/lib/ionic/css/ionic.css',
        'www/css/style.css'
    ])
        .pipe(concat('app.css'))
        .pipe(minifyCss({keepSpecialComments: 0}))
        .pipe(replace('VERSION', version))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('js-lib', function () {
    return gulp.src([
        'www/lib/ionic/js/ionic.bundle.min.js'

    ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('dist/js/'));
});
gulp.task('js-libf', function () {
    return gulp.src([
        'www/js/lib/angular-resource.min.js',
        'www/js/lib/ngIOS9UIWebViewPatch.js',
        'www/js/lib/zepto.min.js',
        'www/js/lib/angular-file-upload.js',
        'www/js/lib/angular-webstorage.js',
        'www/js/lib/angular-webstorage-utils.js',
        'www/js/lib/MD5.js',
        'www/js/lib/fabric-all-min.js',
        'www/js/lib/makePy.min.js',
        'www/js/lib/pingpp_pay.js'
    ])
        .pipe(concat('lib_f.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('js-app', function () {
    return merge2(
        gulp.src([
            'www/js/app.js',
            'www/js/controllers.js',
            'www/js/services.js',
            'www/js/lib/lb-services.js'
        ]),
        gulp.src('www/templates/*.html')
            .pipe(minifyHtml({empty: true, quotes: true}))
            .pipe(ngTemplate({
                moduleName: 'pictcakeTemplates',
                standalone: true,
                filePath: 'templates.js'
            })
        )
    )
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('js-lib1', function () {
    return gulp.src([
        'www/lib/ionic/js/ionic.bundle.min.js'

    ])
        .pipe(concat('lib.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('dist/js/'));
});
gulp.task('js-libf1', function () {
    return gulp.src([
        'www/js/lib/angular-resource.min.js',
        'www/js/lib/ngIOS9UIWebViewPatch.js',
        'www/js/lib/zepto.min.js',
        'www/js/lib/angular-file-upload.js',
        'www/js/lib/angular-webstorage.js',
        'www/js/lib/angular-webstorage-utils.js',
        'www/js/lib/MD5.js',
        'www/js/lib/fabric-all-min.js',
        'www/js/lib/makePy.min.js',
        'www/js/lib/pingpp_pay.js'
    ])
        .pipe(concat('lib_f.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('dist/js/'));
});
gulp.task('js-app1', function () {
    return merge2(
        gulp.src([
            'www/js/app.js',
            'www/js/controllers.js',
            'www/js/services.js',
            'www/js/lib/lb-services.js'
        ]),
        gulp.src('www/templates/*.html')
            .pipe(minifyHtml({empty: true, quotes: true}))
            .pipe(ngTemplate({
                moduleName: 'pictcakeTemplates',
                standalone: true,
                filePath: 'templates.js'
            })
        )
    )
        .pipe(concat('app.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('alipay', function () {
    return gulp.src([
        'www/js/lib/pay.htm',
        'www/js/lib/ap.js',
        'www/*.*'
    ]).pipe(gulp.dest('dist/'));
});

gulp.task('files', function () {
    return gulp.src(['www/img/*'])
        .pipe(gulp.dest('dist/img/'));
});
gulp.task('woff', function () {
    return gulp.src(['www/css/*.woff2'])
        .pipe(gulp.dest('dist/css/'));
});


gulp.task('font', function () {
    return gulp.src('www/lib/ionic/fonts/*')
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('usemin', function () {
    return gulp.src('dist/index.html')
        .pipe(usemin({
            css: [minifyCss({keepSpecialComments: 0}), rev()],
            // html: [minifyHtml({empty: true})],
            js: [uglify({mangle: false})]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulpSequence('clean', ['jshint', 'css', 'alipay', 'font', 'js-lib', 'js-libf', 'js-app', 'files','woff']));

gulp.task('build', gulpSequence('clean', ['jshint', 'css', 'alipay', 'font', 'js-lib1', 'js-libf1', 'js-app1', 'files','woff']));

gulp.task('build2', gulpSequence('build', 'usemin'));

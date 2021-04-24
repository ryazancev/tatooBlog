const gulp = require('gulp');
const {src, dest, series, parallel, watch} = gulp;
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');

sass.compiler = require('node-sass');

const serve = () => {
    browserSync.init({
        server: {baseDir: 'src/'},
        notify: false,
        online: true
    });
};

const styles = () => {
    return src ('src/styles/main.scss')
        .pipe(sass())
        .pipe(concat('main.min.css'))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'], grid: true }))
        .pipe(cleanCss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } ))
        .pipe(dest('src/css/'))
        .pipe(browserSync.stream())
};

const scripts = () => {
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'src/scripts/modules/*.js'
    ])
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(dest('src/scripts/'))
        .pipe(browserSync.stream())
};

const startWatch = () => {
    watch(['src/**/*.js', '!src/**/*.min.js'], scripts);
    watch('src/**/*.scss', styles);
    watch('src/**/*.html').on('change', browserSync.reload);
    watch('src/images/src/**/*', images);
};

const images = () => {
    return src('src/images/src/**/*') // Берём все изображения из папки источника
        .pipe(newer('src/images/dest/')) // Проверяем, было ли изменено (сжато) изображение ранее
        .pipe(imagemin()) // Сжимаем и оптимизируем изображеня
        .pipe(dest('src/images/dest/'))
};

const cleanimg = () => {
    return del('src/images/dest/**/*', { force: true }) // Удаляем всё содержимое папки "scripts/images/dest/"
};

const buildcopy = () => {
    return src([ // Выбираем нужные файлы
        'src/css/**/*.min.css',
        'src/scripts/**/*.min.js',
        'src/images/dest/**/*',
        'src/**/*.html',
    ], { base: 'src' }) // Параметр "base" сохраняет структуру проекта при копировании
        .pipe(dest('build'))
};

const cleandist = () => {
    return del('build/**/*', { force: true }) // Удаляем всё содержимое папки "dist/"
}

exports.serve = serve;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;

exports.build = series(cleandist, styles, scripts, images, buildcopy);
exports.default = parallel(styles, scripts, serve, startWatch);
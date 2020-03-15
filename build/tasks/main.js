var gulp = require('gulp');

var ts = require("gulp-typescript");
var fs = require("fs");
const pug = require("pug");
const path = require("path");
var tsProject = ts.createProject("tsconfig.json");
var minify = require("gulp-minify");
var rename = require('gulp-rename');
var maker = require("echarts-mapmaker/src/maker");

ECHARTS_BUILTIN_MAPS = [
  '!./node_modules/echarts/map/js/province/xizang.js',
  '!./node_modules/echarts/map/js/province/shanghai.js',
  '!./node_modules/echarts/map/js/province/chongqing.js',
  '!./node_modules/echarts/map/js/province/beijing.js',
  '!./node_modules/echarts/map/js/province/xianggang.js',
  '!./node_modules/echarts/map/js/province/aomen.js',
  '!./node_modules/echarts/map/js/province/tianjin.js',
  '!./node_modules/echarts/map/js/province/xinjiang.js',
  '!./node_modules/echarts/map/js/province/taiwan.js',   // not to use default tai wan map
  '!./node_modules/echarts/map/js/province/sichuan.js',   // not to use default sichuan map
  './node_modules/echarts/map/js/province/*.js',
  './updated-xizang/xizang.js'
]

FILE_MAP = {
    "guangdong": "guangdong",
    "anhui": "anhui",
    "fujian": "fujian",
    "gansu": "gansu",
    "guangxi": "guangxi",
    "guizhou": "guizhou",
    "hainan": "hainan",
    "hebei": "hebei",
    "heilongjiang": "heilongjiang",
    "henan": "henan",
    "hubei": "hubei",
    "hunan": "hunan",
    "jiangsu": "jiangsu",
    "jiangxi": "jiangxi",
    "jilin": "jilin",
    "liaoning": "liaoning",
    "neimenggu": "neimenggu",
    "ningxia": "ningxia",
    "qinghai": "qinghai",
    "shandong": "shandong",
    "shanxi": "shanxi",
    "shanxi1": "shanxi1",
    "sichuan": "sichuan",
    "taiwan": "taiwan",
    "xinjiang": "xinjiang",
    "xizang": "xizang",
    "yunnan": "yunnan",
    "zhejiang": "zhejiang"
}

PROVINCE_PINYIN_MAP = {
    "广东": "guangdong",
    "安徽": "anhui",
    "福建": "fujian",
    "甘肃": "gansu",
    "广西": "guangxi",
    "贵州": "guizhou",
    "海南": "hainan",
    "河北": "hebei",
    "黑龙江": "heilongjiang",
    "河南": "henan",
    "湖北": "hubei",
    "湖南": "hunan",
    "江苏": "jiangsu",
    "江西": "jiangxi",
    "吉林": "jilin",
    "辽宁": "liaoning",
    "内蒙古": "neimenggu",
    "宁夏": "ningxia",
    "青海": "qinghai",
    "山东": "shandong",
    "山西": "shanxi",
    "陕西": "shanxi1",
    "四川": "sichuan",
    "台湾": "taiwan",
    "新疆": "xinjiang",
    "西藏": "xizang",
    "云南": "yunnan",
    "浙江": "zhejiang"
}

gulp.task("echarts-maps", function(){
  gulp.src(ECHARTS_BUILTIN_MAPS)
    .pipe(rename({dirname: ''}))
	.pipe(minify({
      noSource: true,
	  ext: { min: ".js"}
	}))
	.pipe(gulp.dest('echarts-china-provinces-js'));
});

gulp.task("configuration", function () {
  obj = {};
  obj.FILE_MAP = Object.assign({}, obj.FILE_MAP, FILE_MAP);
  obj.PINYIN_MAP = Object.assign({}, obj.PINYIN_MAP, PROVINCE_PINYIN_MAP);
  obj.JUPYTER_URL = '/nbextensions/echarts-china-provinces-js';
  obj.JUPYTER_ENTRY = 'echarts-china-provinces-js/main';
  obj.JS_FOLDER = 'echarts-china-provinces-js';
  obj.GITHUB_URL = 'https://echarts-maps.github.io/echarts-china-provinces-js/echarts-china-provinces-js';
  fs.writeFile('./registry.json', JSON.stringify(obj, null, 4), function (err){
    if (err) throw err;
  });

});

gulp.task("preview", function(){
  var index = pug.compileFile(path.join("templates", "preview.pug"));
  var provinces = Object.keys(PROVINCE_PINYIN_MAP);
  var options = {
    countryFiles:  Object.values(FILE_MAP),
    countries: provinces};
  fs.writeFile('preview.html', index(options), function(err){
    if(err) throw err;
  });
});


gulp.task("main", function(){
    tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
    gulp.src(['dist/main.js'])
	.pipe(minify({
	    ext: { src: ".js", min: ".js"}
	}))
	.pipe(gulp.dest('echarts-china-provinces-js'));
});

var gulp = require('gulp');
var maker = require('echarts-mapmaker/src/maker');
var mapshaper = require('mapshaper');
var minify = require("gulp-minify");
var fs = require('fs');

function disolve(command){
  return new Promise((resolve, reject) => {
    mapshaper.runCommands(command, (error) => {
      if(error){reject(error);};
      resolve();
    });
  });
}

//geojson对象
function Geojson() {
    this.type  = "FeatureCollection";
    this.features =[];
}


function transform(geojson, geojson4echarts, mapName){
  data = fs.readFileSync(geojson, 'utf8')
  var shaper = JSON.parse(data);
  var echartsJson = new Geojson();
  echartsJson.features = [
    {
      "type": "Feature",
      "properties": {
        "name": mapName
      },
      "geometry": shaper.geometries[0]
    }
  ];

  fs.writeFileSync(geojson4echarts, JSON.stringify(echartsJson));
}


gulp.task("panzihua", function() {
  maker.splitAsGeojson('node_modules/echarts/map/json/province/sichuan.json', '.');
  maker.decompress('攀枝花市.geojson', 'd_pan.geojson');
  disolve('d_pan.geojson -dissolve2 -o d_pan_shape_only.geojson').then(()=>{
    transform('d_pan_shape_only.geojson', 'd_pan_shape_only_echarts.geojson', '攀枝花市');
    maker.compress('d_pan_shape_only_echarts.geojson', 'utf_encoded_pan_shape_only.geojson');
    maker.merge('node_modules/echarts/map/json/province/sichuan.json', 'utf_encoded_pan_shape_only.geojson');
    maker.makeJs('merged_sichuan.json', 'sichuan.js', '四川');
    gulp.src('./sichuan.js', {base: '.'})
      .pipe(minify({
        noSource: true,
	    ext: { min: ".js"}
	  }))
	  .pipe(gulp.dest('echarts-china-provinces-js'));
    const regex = /[.]geojson$/;
    fs.readdirSync('.')
      .filter(f => regex.test(f))
      .map(f => fs.unlinkSync(f));
    }, (error)=>{console.log(error)});
});

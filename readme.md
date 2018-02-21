# echarts-china-provinces-js

It integrates echarts province maps to jupyter notebook as nbextensions and echarts libraries will be served from http://localhost:8888/nbextensions/echarts-china-provinces-js/.


## Installation to jupyter

```shell
jupyter nbextension install echarts-china-provinces-js
jupyter nbextension enable echarts-china-provinces-js/main
```

## Development

Please get all depdencies

```shell
npm install -g gulp
npm install
```

Then build

```shell
gulp
```

You will then obtain all echarts libraries in echarts folder.


## License

This bundling code is MIT license
The echarts maps are included here under BSD-3 license of Baidu Inc.

#### Exception on the map license

1. Taiwan map, is taken from [natural earth](http://www.naturalearthdata.com/about/terms-of-use/) and hence is
in public domain. Again, No Liability nor Guarantee were given for any error or flaws by Natural Earth or by
this project.

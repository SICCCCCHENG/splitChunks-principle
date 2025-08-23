

import modules1 from './module1'
import modules2 from './module2'
import jquery from 'jquery'

console.log(modules1, modules2, jquery);
import(/* webpackChunkName: "asyncModule1" */ './asyncModule1')
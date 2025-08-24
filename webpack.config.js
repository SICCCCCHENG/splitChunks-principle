const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: 'development',
    devtool: false,
    entry: {
        // page1: './src/page1.js',
        // page2: './src/page2.js',
        // // page3: './src/page3.js',

        // case 2
        // page1: './src/case2/page1.js',
        // page2: './src/case2/page2.js',
        // page3: './src/case2/page3.js',

        // case 3
        // page1: './src/case3/page1.js',
        // page2: './src/case3/page2.js',
        // page3: './src/case3/page3.js',

        // case4
        home: './src/case4-runtime原理/home.js',
        login: './src/case4-runtime原理/login.js',
    },
    optimization: {
        // 设置代码块分割方案
        splitChunks: {
            // 此处是公共配置

            // all / initial / async    默认只分割 async
            // initial -> 同步 import require
            // async -> 异步 import()
            // all -> initial + async
            chunks: 'all',

            // 同一个入口分割出来的最大异步请求数  表示一个入口最多可以分割几个代码块出来(包括自己)
            // 此处看优先级, 优先级高的先分割, 不够了的就放一起
            maxAsyncRequests: 3,  // 同一个入口分割出来的最大异步请求数
            // 同一个入口分割出来的最大同步请求数  表示一个入口最多可以分割几个代码块出来(包括自己)
            // 此处看优先级, 优先级高的先分割, 不够了的就放一起
            maxInitialRequests: 5,

            // 提取之后的总大小
            minSize: 0,  // 被提取代码块的最小尺寸   默认值 30k(大于30k才会被提取)

            // 公共代码块叫  page1~page2
            name: true,  // 设置代码块打包后的名称   默认名称是用分隔符 ~ 分割开的原始代码块
            automaticNameDelimiter: '~',
            // 缓存组 可以设置不同的缓存组来满足不同的chunk
            // webpack中有一些默认缓存组, 其优先级是 0
            cacheGroups: {
                // 把符合条件的缓存组都放在 vendors 代码块里
                // 第三方提供的
                vendors: {
                    // chunks: 'all',  // 此处优先级高
                    test: /[\\/]node_modules[\\/]/,   // 条件
                    // 如果一个模块符合多个缓存组的条件
                    priority: -10, //数字越大,优先级越高
                    reuseExistingChunk: false  // 表示已经生成了, 就不再额外生成了, 共用一份
                },
                // 提取不同代码块之间的公共代码
                // commons~page1~page2
                // commons 名字随便写 default(优先级是 -20) 都可,如果优先级低于 -20, 且配置一样 就会走默认了
                default: {
                    // chunks: 'all',
                    minChunks: 2,  // 个数: 如果一个代码块被两个以及两个以上的代码块引用,就可以提取出来
                    // minSize: 8, // 还要大于8字节 才可以被提取    默认 30000 -> 30k   // 提取之后的总大小
                    priority: -20,
                    reuseExistingChunk: false  // 表示已经生成了, 就不再额外生成了, 共用一份
                }
            }
        },
        /**
         * 优化持久化缓存 runtime: webpack 的运行环境 (作用是)
         *  
         *  分离运行时代码：将 webpack 的运行时代码（runtime）提取到单独的 chunk 中，而不是内联到每个 bundle 文件中。
            避免重复：当多个入口文件或动态导入时，webpack 的运行时代码可能会重复出现在多个 bundle 中，使用 runtimeChunk 可以避免这种重复。
            提高缓存效率：运行时代码通常变化较少，单独提取后可以利用浏览器缓存，当业务代码变化时，运行时代码的缓存仍然有效。
         */
        runtimeChunk: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/case4-runtime原理/index.html',
            chunks: ['home'],
            filename: 'home.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/case4-runtime原理/index.html',
            chunks: ['login'],
            filename: 'login.html'
        })
    ]
}


// 如果vendors 里面打包了 jquery 和 lodash, 但是 asyncModule1 只用到了其中的一个, 也不会再重复打包了, 而是复用


/**
 * case 3 应该出现以下结果
 *
 * vendors~page1~page2~page3.js: jquery
 * vendors~asyncModule1.js: lodash
 * asyncModule1.js: asyncModule1.js
 * default~page1~page2~page3.js:  module1
 *
 * page1: page1
 * page2: page2
 * page3: page3 + module3
 */


// runtimeChunk below
/**
 *
 * 什么是运行时代码？
    运行时代码是 webpack 在打包过程中自动生成的代码，用于：
    模块加载和解析：处理模块之间的依赖关系
    代码分割：管理动态导入的模块
    模块热替换：在开发模式下实现热更新
    异步加载：处理 import() 等动态导入


    运行时代码          vs          业务代码
    webpack 自动生成	            开发者编写
    处理模块系统	                 实现具体功能
    变化较少	                    经常变化
    与业务逻辑无关	                包含业务逻辑


    // 业务代码
    import('./utils.js').then(utils => {
    console.log(utils.add(1, 2));
    });

    // 运行时代码（简化版）
    __webpack_require__.e = function(chunkId) {
    return Promise.all(Object.keys(__webpack_require__.c).map(function(webpackChunkName) {
        if(__webpack_require__.o(__webpack_require__.c, webpackChunkName) && __webpack_require__.c[webpackChunkName].e) {
        __webpack_require__.c[webpackChunkName].e(chunkId);
        }
    }));
    };

    为什么要分离？
    避免重复：多个入口文件时，运行时代码会重复
    缓存优化：运行时代码变化少，可以长期缓存
    体积优化：主 bundle 更小，加载更快
    当你的应用有多个页面或使用动态导入时，分离运行时代码的好处就体现出来了。
 */



// case4
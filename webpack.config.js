

module.exports = {
    mode: 'development',
    devtool: false,
    entry: {
        // page1: './src/page1.js',
        // page2: './src/page2.js',
        // // page3: './src/page3.js',

        // case 2
        page1: './src/case2/page1.js',
        page2: './src/case2/page2.js',
        page3: './src/case2/page3.js',
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

            maxAsyncRequests: 5,  // 同一个入口分割出来的最大异步请求数
            maxInitialRequests: 3,   // 同一个入口分割出来的最大同步请求数

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
                    chunks: 'all',  // 此处优先级高
                    test: /[\\/]node_modules[\\/]/,   // 条件
                    // 如果一个模块符合多个缓存组的条件
                    priority: -10, //数字越大,优先级越高
                },
                // 提取不同代码块之间的公共代码
                // commons~page1~page2
                // commons 名字随便写 default(优先级是 -20) 都可,如果优先级低于 -20, 且配置一样 就会走默认了
                commons: {
                    chunks: 'all',
                    minChunks: 2,  // 个数: 如果一个代码块被两个以及两个以上的代码块引用,就可以提取出来
                    // minSize: 8, // 还要大于8字节 才可以被提取    默认 30000 -> 30k   // 提取之后的总大小
                    priority: -20,  
                    // reuseExistingChunk: true
                }
            }
        }
    }
}
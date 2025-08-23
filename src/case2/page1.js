
// 异步代码肯定会被分割, 与 minChunks 没有关系
import('./title').then(result => {
    console.log(result.default);
})
/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-24 09:55:55
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-24 09:56:23
 * @ Description: 运行时配置
 */

// While the blocklet is deploy to a sub path, this will be work properly.
window.publicPath = window?.blocklet?.prefix || '/';
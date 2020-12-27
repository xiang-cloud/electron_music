exports.$ = (id) => {
    return document.getElementById(id)
}
exports.convertDuration = (time) => {
    // 计算分钟
    const munutes = "0"+Math.floor(time / 60)
    const seconds = "0"+Math.floor(time - munutes * 60)
    return munutes.substr(-2) +":"+ seconds.substr(-2)
}
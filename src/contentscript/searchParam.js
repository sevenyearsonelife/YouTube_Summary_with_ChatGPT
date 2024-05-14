export function getSearchParam(str) {

    const searchParam = (str && str !== "") ? str : window.location.search;

    if (!(/\?([a-zA-Z0-9_]+)/i.exec(searchParam))) return {};
    let match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^?&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        index = /\?([a-zA-Z0-9_]+)/i.exec(searchParam)["index"]+1,
        query  = searchParam.substring(index);

    let urlParams = {};
    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
    
}

// 如何提高编程效率？
// 编程世界中有大量的不同级别的封装
// 对于这个函数，你不需要了解其实现细节
// 只需要知道输入和输出是什么
// 大模型很擅长这个
// 要擅于使用大模型

// 假设url是：http://example.com/?name=John+Doe&age=30
// 处理结果为：
// {
//     name: "John Doe",
//     age: "30"
// }

// console.log(getSearchParam("?city=New+York&country=USA"));
// {
//     city: "New York",
//     country: "USA"
// }
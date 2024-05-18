"use strict";

import { insertSummaryBtn } from "./youtube";

// 如何查看控制台的打印信息？
// 在插件加载页面，点击【服务工作进程】
console.log("all is well! This is from index.js.");

let oldHref = "";

window.onload = async () => {
        
    if (window.location.hostname === "www.youtube.com") {
        
        if (window.location.search !== "" && window.location.search.includes("v=")) {
            // 原来这个插件的按钮是这种方式导入的
            insertSummaryBtn();
        }

        const bodyList = document.querySelector("body");
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Example URL: Suppose the URL is https://www.example.com:8080/path/index.html?search=test#section1. 
                // Here, document.location.href would be this entire string.
                // from gpt4
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    insertSummaryBtn();
                }
            });
        });
        // Start observing the target node for configured mutations
        // from gpt4
        observer.observe(bodyList, { childList: true, subtree: true });

    }

    //if (window.location.hostname === "chat.openai.com") {
    if (window.location.hostname === "chatgpt.com") {
        //不显示打印
        console.log("hello from chatgpt");
        if (document.getElementsByTagName("textarea")[0]) {
            document.getElementsByTagName("textarea")[0].focus();
            // If search query is "?ref=glasp"
            // 意味着当前的chatgpt页面时从glasp插件页面跳转过来的
            //if (window.location.search === "?ref=glasp") {
            if (window.location.search.includes("ref=glasp")) {
                // get prompt from background.js
                chrome.runtime.sendMessage({ message: "getPrompt" }, (response) => {
                    // 期望从后台脚本接收提示文本并将其放置在文本区域中
                    document.getElementsByTagName("textarea")[0].value = response.prompt;
                    document.getElementsByTagName("textarea")[0].value = "hello";
                    
                    // 这几行打印应该在哪里看呢？
                    console.log("from chatgpt");
                    console.log(response.prompt);

                    if (response.prompt !== "") {
                        console.log("response.prompt不为空");
                        document.getElementsByTagName("textarea")[0].focus();
                        // 以编程的方式点击页面上的按钮
                        document.getElementsByTagName("button")[document.getElementsByTagName("button").length-1].click();
                    }
                });
            }
        }
    }
    
}
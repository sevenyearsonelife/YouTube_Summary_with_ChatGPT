"use strict";

import { insertSummaryBtn } from "./youtube";

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

    if (window.location.hostname === "chat.openai.com") {
        if (document.getElementsByTagName("textarea")[0]) {
            document.getElementsByTagName("textarea")[0].focus();
            // If search query is "?ref=glasp"
            if (window.location.search === "?ref=glasp") {
                // get prompt from background.js
                chrome.runtime.sendMessage({ message: "getPrompt" }, (response) => {
                    document.getElementsByTagName("textarea")[0].value = response.prompt;
                    if (response.prompt !== "") {
                        document.getElementsByTagName("textarea")[0].focus();
                        document.getElementsByTagName("button")[document.getElementsByTagName("button").length-1].click();
                    }
                });
            }
        }
    }
    
}
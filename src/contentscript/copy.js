export function copyTextToClipboard(text) {

    // 检查 navigator.clipboard API 在用户的浏览器中是否可用
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    } else {
        // 如果支持 navigator.clipboard API，它将使用 writeText 方法将文本复制到剪贴板。
        // 该方法返回一个承诺。该代码处理成功和错误情况，但处理程序是空的，这意味着它对成功或失败不执行任何操作。
        navigator.clipboard.writeText(text).then(function () {
        }, function (err) {
        });
    }
    function fallbackCopyTextToClipboard(text) {
        // 创建一个隐藏的textArea元素
        var textArea = document.createElement("textarea");
        textArea.value = text;
        
        // 固定在屏幕的左上角
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);

        // 关注并选中
        textArea.focus();
        textArea.select();

        try {
            // 执行复制命令
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
        } catch (err) {
        }

        document.body.removeChild(textArea);
    }
}
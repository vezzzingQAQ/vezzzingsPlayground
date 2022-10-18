; ((doc, Socket, storage, location) => {

    const oList = doc.querySelector("#list");
    const oMsg = doc.querySelector("#message");
    const oSendBtn = doc.querySelector("#send");

    // ws实例
    const ws = new Socket("ws:10.61.65.32:4999");

    let username = "";

    const init = () => {
        bindEvent();
    }

    function bindEvent() {
        oSendBtn.addEventListener("click", handleSendBtnClick, false);
        // ws事件
        ws.addEventListener("open", handleWsOpen);
        ws.addEventListener("close", handleWsClose);
        ws.addEventListener("error", handleWsError);
        ws.addEventListener("message", handleWsMessage);
    }

    function handleSendBtnClick() { // 向所有客户端广播
        console.log("send message");
        const msg = oMsg.value;
        if (!msg.trim().length) {
            return;
        }
        ws.send(JSON.stringify({
            user: username,
            dateTime: new Date().getTime(),
            message: msg
        }));
        oMsg.value = "";
    }

    function handleWsOpen() {
        console.log("ws open");
        username = storage.getItem("username");
        if (!username) {
            location.href = "./entry.html";
            return;
        }
    }

    function handleWsClose() {
        console.log("ws close");
    }

    function handleWsError() {
        console.log("ws error");
    }

    async function handleWsMessage(e) { // 事件对象包含收到的消息
        console.log("ws message");
        let messageData = "";
        if (e.data instanceof Blob) {
            // blob转换为字符串
            messageData = JSON.parse(await e.data.text());
        } else {
            messageData = JSON.parse(e.data);
        }
        // 附加到oList中
        oList.appendChild(createMsgDom(messageData));
    }

    function createMsgDom(data) {
        const { user, dateTime, message } = data;
        const oItem = doc.createElement("li");
        oItem.innerHTML = `
        <p class="infoP">
            <span class="userSpan">${user}</span>
            <span class="dateTimeSpan">${new Date(dateTime)}</span>
        </p>
        <p class="msgP">
            ${message}
        </p>
        `;
        return oItem;
    }

    init();

})(document, WebSocket, localStorage, location);
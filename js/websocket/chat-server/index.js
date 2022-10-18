const Ws = require("ws");

; ((Ws) => {
    // 构造服务器
    const server = new Ws.Server({ port: 4999 });

    const init = () => {
        bindEvent();
    }

    function bindEvent() {
        server.on("open", handleServerOpen);
        server.on("close", handleServerClose);
        server.on("error", handleServerError);
        server.on("connection", handleServerConnection);
    }

    function handleServerOpen() {
        console.log("ws open");
    }

    function handleServerClose() {
        console.log("ws close");
    }

    function handleServerError() {
        console.log("ws error");
    }

    function handleServerConnection(ws) {
        console.log("ws connection");
        ws.on("message", handleServerConnectionMessage);
    }

    function handleServerConnectionMessage(msg) {
        console.log("ws message" + msg);
        // 广播给所有客户端
        server.clients.forEach((c) => {
            c.send(msg);
        })
    }

    init();
})(Ws);
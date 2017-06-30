module.exports = function(url, clear, flash, shouldReload, win, doc)
{
    if(url == "") {
        return function(){};
    }
    win = win || window;
    doc = doc || document;
    var addHost = function(s)
    {
        var l = win.location;
        return ((l.protocol === "https:") ? "wss://" : "ws://") + l.host + s;
    }
    url = url.indexOf("://") === -1 ? addHost(url) : url;
    shouldReload = shouldReload || function(){ return true; }

    return function()
    {
        var reconnect = true;
        var connect = function()
        {
            var ws = new WebSocket(url);
            Object.assign(
                ws,
                {
                    onmessage: function(e)
                    {
                        var extension = e.data.split(".").pop();
                        var message = "Edited file:///" + e.data + ".";
                        flash.add(message);
                        clear(e.data).then(
                            function(reload)
                            {
                                if(shouldReload(e.data, extension)) {
                                    message += "File reloaded via full refresh";
                                    // flash.add(message);
                                    ws.onclose = function()
                                    {
                                        reload();
                                    }
                                    ws.close();
                                } else {
                                    message += " File reloaded via inline refresh";
                                    console.debug(message);
                                }
                            }
                        );
                    },
                    onerror: function(e)
                    {
                        reconnect = false;
                        console.debug("Unable to connect to websocket. Please see https://greenhouse.gardenhq.io/o/docs/development/setting-up-reloading.html");
                    },
                    onclose: function(e)
                    {
                        if(reconnect) {
                            connect();
                        }
                    }
                }
            );
            win.onbeforeunload = function()
            {
                ws.onclose = function () {};
                ws.close()
            };

        }
        connect();
    }
}

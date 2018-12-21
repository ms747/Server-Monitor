const http = require("http"),
    fs = require("fs"),
    index = fs.readFileSync(__dirname + "/index.html");

const cmd = require("node-cmd");

const app = http.createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(index);
});

const io = require("socket.io").listen(app);
const Promise = require("bluebird");

const no_ping = 1;

const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

io.on("connection", function(socket) {
    socket.on("status", async data => {
        const pingPromise = [];
        data.ip.forEach(ip => {
            pingPromise.push(
                getAsync(
                    `ping -c ${no_ping} ${
                        ip.ip
                    } | grep packet | awk '{print $4}'`
                )
            );
            if (ip.childs) {
                ip.childs.forEach(childip => {
                    pingPromise.push(
                        getAsync(
                            `ping -c ${no_ping} ${
                                childip.ip
                            } | grep packet | awk '{print $4}'`
                        )
                    );
                });
            }
        });
        const result = await Promise.all(pingPromise);
        const newRes = result.reduce((acc, curr, index) => {
            if (curr[0][0].trim() === no_ping.toString()) {
                acc.push(true);
            } else {
                acc.push(false);
            }
            return acc;
		}, []);
		let counter = 0;
        const newData = data.ip.reduce((acc, prev, index) => {
			if(prev.childs){
				const children = []
				prev.childs.forEach(prevchild => {
					Object.assign(prevchild,{status:newRes[counter++]})
					children.push(prevchild)
				})
				prev.childs = children
			}
			Object.assign(prev,{status:newRes[counter++]})
			acc.push(prev)
			return acc
		}, []);
        console.log(newData);
        socket.emit("status", newData);
    });
});

app.listen(3000);

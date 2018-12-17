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
		const promises = [];
		data.ip.forEach(ip => {
			promises.push(getAsync(`ping -c ${no_ping} ${ip} | grep packet | awk '{print $4}'`));
		});
		const result = await Promise.all(promises);
		const newRes = result.reduce((acc, curr, index) => {
			if (curr[0][0].trim() === no_ping.toString()) {
				acc.push({ ip: data.ip[index], state: true });
			} else {
				acc.push({ ip: data.ip[index], state: false });
			}
			return acc;
		}, []);
		socket.emit("status", newRes);
	});
});

app.listen(3000);

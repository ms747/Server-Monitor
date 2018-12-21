const ssh = require("ssh2").Client

const srv1 = new ssh()

srv1
    .on("ready", () => {
        console.log("ready")
        srv1.exec("qm list",(err,channel)=>{
            console.log(channel)
        })
    })
    .connect({
        host: '10.10.10.12',
        port: 22,
        username: "root",
        privateKey: require("fs").readFileSync("/home/testubuntu/.ssh/id_rsa")
    })

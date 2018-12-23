import React from "react";
import { socketConnect } from "reactjs-socket.io";
import { ip } from "./iplist";

function Offline() {
    return <span style={{ color: "red" }}>Offline</span>;
}

function Online() {
    return <span style={{ color: "green" }}>Online</span>;
}

function List(props) {
    return (
        <tbody>
            {props.status.map((ip, index) => {
                return (
                    <React.Fragment key={ip.name}>
                        <tr className={ip.status ? "table-success" : "table-danger"}>
							<td>
								<h3>
									{ip.id}
								</h3>
							</td>
                            <td>
                                <h3>{`${ip.name} (${ip.ip})`}</h3>
                            </td>
                            <td>{ip.status ? <Online /> : <Offline />}</td>
                        </tr>
                        {ip.childs
                            ? ip.childs.map(child => {
                                  return (
                                      <tr key={child.name} className={ip.status ? "table-success" : "table-danger"}>
                                          <td>{child.id}</td>
                                          <td>{`${ip.name}@${child.name} (${child.ip})`}</td>
                                          <td>
                                              {child.status ? (
                                                  <Online />
                                              ) : (
                                                  <Offline />
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })
                            : null}
                    </React.Fragment>
                );
            })}
        </tbody>
    );
}

class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ip: ip,

            status: []
        };
        setInterval(() => {
            this.props.io.emit("status", { ip: this.state.ip });
        }, 5000);

        this.props.io.on("status", data => {
            this.setState({ status: data }, () => {
                console.log(this.state.status);
            });
        });
    }

    componentWillMount() {
        this.props.io.emit("status", { ip: this.state.ip });
    }

    render() {
        return (
            <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
						<th scope="col">Status</th>
                    </tr>
                </thead>
                <List status={this.state.status} />
            </table>
        );
    }
}

export default socketConnect(Status);

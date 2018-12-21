import React from "react";
import { socketConnect } from "reactjs-socket.io";

function Offline() {
  return <span style={{ color: "red" }}>Offline</span>;
}

function Online() {
  return <span style={{ color: "green" }}>Online</span>;
}

function List(props) {
	return (
		<tbody>
			{props.status.map(stat => {
				return (
					<tr key={stat.ip}>
						<td>{stat.ip}</td>
						<td>{stat.state ? <Online/>: <Offline/>}</td>
					</tr>
				);
			})}
		</tbody>
	);
}

class Status extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ip: ["10.10.10.12", "10.10.10.121","10.10.10.105","10.10.10.13","10.10.10.104","10.10.10.14","10.10.10.102","10.10.10.107","10.10.10.109","10.10.10.15","10.10.10.101","10.10.10.106","10.10.10.110","10.10.10.111","10.10.10.114","10.10.10.9","10.10.10.11","10.10.10.50","10.10.10.81"],

			status: [],
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
  
  componentWillMount(){
    this.props.io.emit("status", { ip: this.state.ip });
  }

	render() {
		return (
			<table className="table">
				<thead className="thead-dark">
					<tr>
						<th scope="col">IP</th>
						<th scope="col">Status</th>
					</tr>
				</thead>
				<List status={this.state.status} />
			</table>
		);
	}
}

export default socketConnect(Status);



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
			ip: ["10.10.10.1", "10.10.10.5", "10.10.10.2"],

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



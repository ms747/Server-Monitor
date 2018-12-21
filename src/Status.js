import React from "react";
import { socketConnect } from "reactjs-socket.io";
import newIp,{ip} from "./iplist";

function Offline() {
  return <span style={{ color: "red" }}>Offline</span>;
}

function Online() {
  return <span style={{ color: "green" }}>Online</span>;
}

function List(props) {
	return (
		<tbody>
			{props.status.map((stat,index) => {
				return (
					<tr key={stat.ip}>
						<td>{ip[index]}</td>
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
			ip: ip,

			status: [],
		};
		setInterval(() => {
			this.props.io.emit("status", { ip: this.state.ip });
		}, 5000);

		this.props.io.on("status", data => {
			console.log(data);
			// this.setState({ status: data }, () => {
			// 	console.log(this.state.status);
			// });
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



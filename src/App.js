import React, { Component } from "react";
import "./App.css";
import Status from "./Status";
import Menu from "./menu";

class App extends Component {
	

	render() {
		return (
			<div>
				<Menu/>
				<Status/>
			</div>
		);
	}
}

export default (App);

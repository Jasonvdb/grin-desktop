import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import grinServer from "../../../stores/grinServer";

import { defaultRootStyle, defaultContentStyle } from "../../../styles/theme";

const styles = theme => {
	return {
		root: {
			...defaultRootStyle
		},
		content: {
			...defaultContentStyle
		},
		text: {},
		smallText: {
			fontSize: theme.typography.display1.fontSize
		}
	};
};

class Transactions extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		//TODO when mobx is working this will move to an observer
		this.setState(grinServer.statusDetails);
		this.updateTimers = setInterval(() => {
			this.setState(grinServer.statusDetails);
		}, 1000);
	}

	componentWillUnmount() {
		clearTimeout(this.updateTimers);
	}

	renderDetails() {
		const { classes } = this.props;
		const { connections, protocol_version, tip, user_agent } = this.state;

		if (!connections) {
			return <Typography variant="body1">Loading...</Typography>;
		}

		const {
			height,
			total_difficulty,
			last_block_pushed,
			prev_block_to_last
		} = tip;

		return (
			<div className={classes.content}>
				<div>
					<Typography variant="headline">Node details</Typography>
					<Typography variant="body1">
						Connected peers: <b>{connections}</b>
					</Typography>
					<Typography variant="body1">
						Protocol version: <b>{protocol_version}</b>
					</Typography>
					<Typography variant="body1">
						User agent: <b>{user_agent}</b>
					</Typography>
				</div>

				<div>
					<Typography variant="headline">Chain details</Typography>

					<Typography variant="body1">
						Current chain height: <b>{height}</b>
					</Typography>
					<Typography variant="body1">
						Total difficulty: <b>{total_difficulty}</b>
					</Typography>
					{/* <Typography variant="body1">
						Last block pushed: <b>{last_block_pushed}</b>
					</Typography> */}
				</div>
			</div>
		);
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<Typography variant="display3">About</Typography>
				{this.renderDetails()}
			</div>
		);
	}
}

export default withStyles(styles)(Transactions);

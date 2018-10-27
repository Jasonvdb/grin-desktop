import React, { Component } from "react";
import { observer } from "mobx-react";
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
			fontSize: theme.typography.h4.fontSize
		}
	};
};

@observer
class About extends Component {
	renderDetails() {
		const { classes } = this.props;

		const { isConnected, statusDetails } = grinServer;

		if (!isConnected) {
			return <Typography variant="body2">Loading...</Typography>;
		}

		const { connections, protocol_version, tip, user_agent } = statusDetails;

		const {
			height,
			total_difficulty,
			last_block_pushed,
			prev_block_to_last
		} = tip;

		return (
			<div className={classes.content}>
				<div>
					<Typography variant="h5">Node details</Typography>
					<Typography variant="body2">
						Connected peers: <b>{connections}</b>
					</Typography>
					<Typography variant="body2">
						Protocol version: <b>{protocol_version}</b>
					</Typography>
					<Typography variant="body2">
						User agent: <b>{user_agent}</b>
					</Typography>
				</div>

				<div>
					<Typography variant="h5">Chain details</Typography>

					<Typography variant="body2">
						Current chain height: <b>{height}</b>
					</Typography>
					<Typography variant="body2">
						Total difficulty: <b>{total_difficulty}</b>
					</Typography>
					{/* <Typography variant="body2">
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
				<Typography variant="h2">About</Typography>
				{this.renderDetails()}
			</div>
		);
	}
}

export default withStyles(styles)(About);

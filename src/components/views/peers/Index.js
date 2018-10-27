import React, { Component } from "react";
import { observer } from "mobx-react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import grinServer from "../../../stores/grinServer";
import { defaultRootStyle, defaultContentStyle } from "../../../styles/theme";
import PeersTable from "./PeersTable";

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
class Transactions extends Component {
	constructor(props) {
		super(props);
	}

	renderList() {
		const { classes } = this.props;
		const { isConnected, totalConnectedPeers, connectedPeers } = grinServer;

		if (!isConnected || !connectedPeers) {
			return (
				<div className={classes.content}>
					<Typography variant="h4">Loading...</Typography>
				</div>
			);
		}

		return (
			<div className={classes.content}>
				<Typography className={classes.text} variant="h2">
					{totalConnectedPeers}
					<span style={{ marginLeft: 20 }} className={classes.smallText}>
						connected peers
					</span>
				</Typography>

				<PeersTable connectedPeers={connectedPeers} />
			</div>
		);
	}

	render() {
		const { classes } = this.props;

		return <div className={classes.root}>{this.renderList()}</div>;
	}
}

export default withStyles(styles)(Transactions);

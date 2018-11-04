import React, { Component } from "react";
import { observer } from "mobx-react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import grinWallet from "../../../stores/grinWallet";
import { defaultRootStyle, defaultContentStyle } from "../../../styles/theme";
import grinServer from "../../../stores/grinServer";
import ErrorDialog from "../../common/ErrorDialog";

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
			fontSize: theme.typography.h5.fontSize
		}
	};
};

@observer
class Sync extends Component {
	render() {
		const { classes } = this.props;
		const { getSyncProgress } = grinServer;

		const { base, decimals } = getSyncProgress;

		return (
			<div className={classes.root}>
				<ErrorDialog />
				{getSyncProgress === false ? (
					<div className={classes.content}>
						<Typography className={classes.text} variant="h3">
							Preparing to sync...
							<br />
							<span className={classes.smallText}>
								(This may take a few minutes)
							</span>
						</Typography>
					</div>
				) : (
					<div className={classes.content}>
						<Typography className={classes.text} variant="h1">
							{base}
							<span className={classes.smallText}>.{decimals} %</span>
							<span style={{ marginLeft: 20 }} className={classes.smallText}>
								synced
							</span>
						</Typography>
					</div>
				)}
			</div>
		);
	}
}

export default withStyles(styles)(Sync);

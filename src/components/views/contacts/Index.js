import React, { Component } from "react";
import { observer } from "mobx-react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

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
class Contacts extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<div className={classes.content}>
					<Typography className={classes.text} variant="h2">
						Coming soon
					</Typography>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(Contacts);

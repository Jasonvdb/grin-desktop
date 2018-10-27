import React, { Component } from "react";
import { observer } from "mobx-react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import grinWallet from "../../../stores/grinWallet";
import { defaultRootStyle, defaultContentStyle } from "../../../styles/theme";
import TransactionsTable from "./TransactionsTable";

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
		const { isConnected, formattedTotal, transactions } = grinWallet;

		if (!isConnected || !transactions) {
			return (
				<div className={classes.content}>
					<Typography variant="h4">Loading...</Typography>
				</div>
			);
		}

		return (
			<div className={classes.content}>
				<Typography className={classes.text} variant="h2">
					{formattedTotal.base}
					<span className={classes.smallText}>. {formattedTotal.decimals}</span>
					<span style={{ marginLeft: 20 }} className={classes.smallText}>
						grin
					</span>
				</Typography>

				<TransactionsTable transactions={transactions} />
			</div>
		);
	}

	render() {
		const { classes } = this.props;

		return <div className={classes.root}>{this.renderList()}</div>;
	}
}

export default withStyles(styles)(Transactions);

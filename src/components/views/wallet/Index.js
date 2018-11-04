import React, { Component } from "react";
import { observer } from "mobx-react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import grinWallet from "../../../stores/grinWallet";
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
		},
		actionsContainer: {
			display: "flex",
			justifyContent: "center"
		},
		actionButton: {
			width: 180,
			marginLeft: theme.spacing.unit,
			marginRight: theme.spacing.unit
		}
	};
};

@observer
class Wallet extends Component {
	constructor(props) {
		super(props);

		//When the user clicks we iterate through other balances
		this.otherBalanceTypes = {
			formattedAwaitingConfirmation: "incoming",
			formattedCurrentlySpendable: "spendable",
			formattedAmountImmature: "immature",
			formattedAmountLocked: "locked"
		};

		this.state = {
			selectedOtherBalanceKey: Object.keys(this.otherBalanceTypes)[0]
		};
	}

	nextOtherBalance() {
		const { selectedOtherBalanceKey } = this.state;
		const possibleKeys = Object.keys(this.otherBalanceTypes);
		const currentIndex = possibleKeys.indexOf(selectedOtherBalanceKey);

		const newIndex =
			currentIndex >= possibleKeys.length - 1 ? 0 : currentIndex + 1;

		this.setState({ selectedOtherBalanceKey: possibleKeys[newIndex] });
	}

	renderActionButtons() {
		const { classes } = this.props;

		return (
			<div className={classes.actionsContainer}>
				<Link to="/receive">
					<Button className={classes.actionButton} fullWidth>
						Receive
					</Button>
				</Link>
				<Link to="/send">
					<Button className={classes.actionButton} fullWidth>
						Send
					</Button>
				</Link>
			</div>
		);
	}

	renderOtherBalance() {
		const { classes } = this.props;
		const { selectedOtherBalanceKey } = this.state;
		const formattedValues = grinWallet[selectedOtherBalanceKey];

		return (
			<Typography
				style={{ cursor: "pointer" }}
				onClick={this.nextOtherBalance.bind(this)}
				className={classes.text}
				variant="h3"
			>
				{formattedValues.base}
				<span className={classes.smallText}>
					&nbsp;grin&nbsp;
					{this.otherBalanceTypes[selectedOtherBalanceKey]}
				</span>
			</Typography>
		);
	}

	renderBalances() {
		const { classes } = this.props;
		const { isConnected, formattedTotal } = grinWallet;

		if (!isConnected) {
			return (
				<div className={classes.content}>
					<Typography variant="h4">Loading...</Typography>
				</div>
			);
		}

		const { base, decimals } = formattedTotal;
		return (
			<div className={classes.content}>
				<Typography className={classes.text} variant="h1">
					{base}
					<span className={classes.smallText}>
						{decimals ? `.${decimals}` : ""}
					</span>
					<span style={{ marginLeft: 20 }} className={classes.smallText}>
						grin
					</span>
				</Typography>

				{this.renderOtherBalance()}

				{this.renderActionButtons()}
			</div>
		);
	}

	render() {
		const { classes } = this.props;

		return <div className={classes.root}>{this.renderBalances()}</div>;
	}
}

export default withStyles(styles)(Wallet);

import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import { defaultRootStyle, defaultContentStyle } from "../../../styles/theme";
const { ipcRenderer } = window.require("electron");

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
		},
		actionsContainer: {
			display: "flex"
		},
		actionButtonDiv: {
			flex: 1
		}
	};
};

class Wallet extends Component {
	constructor(props) {
		super(props);

		this.subUnits = 1000000000;

		//When the user clicks we itterate through other balances
		this.otherBalanceTypes = {
			amount_awaiting_confirmation: "awaiting confirmation",
			amount_currently_spendable: "spendable",
			amount_immature: "immature",
			amount_locked: "locked"
		};

		this.state = {
			selectedOtherBalanceKey: Object.keys(this.otherBalanceTypes)[0]
		};
	}

	componentDidMount() {
		//TODO move this to a store
		ipcRenderer.on("grin-wallet-reply", (event, walletInfo) => {
			this.setState(walletInfo[1]);
		});

		this.updateTimer = setInterval(() => {
			this.refreshInfo();
		}, 500);
	}

	componentWillUnmount() {
		clearTimeout(this.updateTimer);
	}

	refreshInfo() {
		ipcRenderer.send("grin-wallet-request", {
			path: "/wallet/owner/retrieve_summary_info?refresh"
		});
	}

	nextOtherBalance() {
		const { selectedOtherBalanceKey } = this.state;

		const possibleKeys = Object.keys(this.otherBalanceTypes);
		const currentIndex = possibleKeys.indexOf(selectedOtherBalanceKey);

		const newIndex =
			currentIndex >= possibleKeys.length - 1 ? 0 : currentIndex + 1; //TODO reset to zero

		this.setState({ selectedOtherBalanceKey: possibleKeys[newIndex] });
	}

	renderActionButtons() {
		const { classes } = this.props;

		return (
			<div className={classes.actionsContainer}>
				<div className={classes.actionButtonDiv}>
					<Button fullWidth>Receive</Button>
				</div>
				<div className={classes.actionButtonDiv}>
					<Button fullWidth>Send</Button>
				</div>
			</div>
		);
	}

	renderOtherBalance() {
		const { classes } = this.props;
		const { selectedOtherBalanceKey } = this.state;

		return (
			<Typography
				style={{ cursor: "pointer" }}
				onClick={this.nextOtherBalance.bind(this)}
				className={classes.text}
				variant="display2"
			>
				{this.state[selectedOtherBalanceKey] / this.subUnits}
				<span className={classes.smallText}>
					&nbsp;grin&nbsp;
					{this.otherBalanceTypes[selectedOtherBalanceKey]}
				</span>
			</Typography>
		);
	}

	renderBalances() {
		const { classes } = this.props;
		const { total } = this.state;

		if (total === undefined) {
			return (
				<div className={classes.content}>
					<Typography variant="display1">Loading...</Typography>
				</div>
			);
		}
		return (
			<div className={classes.content}>
				<Typography className={classes.text} variant="display4">
					{total / this.subUnits}{" "}
					<span className={classes.smallText}>grin</span>
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

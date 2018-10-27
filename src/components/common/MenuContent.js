import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

//Icons
import TransactionIcon from "@material-ui/icons/List";
import ConnectedIcon from "@material-ui/icons/CheckCircle";
import ContactsIcon from "@material-ui/icons/People";
import PeersIcon from "@material-ui/icons/GroupWork";
import WalletIcon from "@material-ui/icons/AccountBalanceWallet";
import SettingsIcon from "@material-ui/icons/Settings";
import AboutIcon from "@material-ui/icons/Info";
import grinServer from "../../stores/grinServer";
import { Typography } from "@material-ui/core";

const styles = theme => ({
	content: {
		flex: 1,
		display: "flex",
		justifyContent: "space-between",
		flexDirection: "column"
	},
	icon: {
		color: theme.palette.text.default,
		marginRight: theme.spacing.unit
	},
	details: {
		textAlign: "center",
		paddingBottom: theme.spacing.unit * 3
	},
	infoSpan: {
		textAlign: "center",
		display: "flex",
		justifyContent: "flex-start"
	}
});

const MenuItem = ({
	to = null,
	children,
	icon,
	toggleDrawer,
	onClick = null,
	expandIcon = null
}) => {
	const listItem = (
		<ListItem button onClick={onClick || toggleDrawer}>
			<ListItemIcon>{icon}</ListItemIcon>
			<ListItemText inset primary={children} />
			{expandIcon}
		</ListItem>
	);

	if (to) {
		return <Link to={to}>{listItem}</Link>;
	}

	return listItem;
};

class MenuContent extends Component {
	constructor(props) {
		super(props);

		this.state = { statusDetails: null };
	}

	componentDidMount() {
		this.setState({ statusDetails: grinServer.statusDetails });
		//TODO when mobx is working this will move to an observer
		this.updateTimer = setInterval(() => {
			grinServer.refreshStatus();
			this.setState({ statusDetails: grinServer.statusDetails });
		}, 200);
	}

	componentWillUnmount() {
		clearTimeout(this.updateTimer);
	}

	// renderStatus(connected) {
	// 	const { classes } = this.props;

	// 	return (
	// 		<span className={classes.infoSpan}>
	// 			<Typography variant="subheading">
	// 				{connected ? "Connected" : "Connecting..."}
	// 			</Typography>
	// 			&nbsp;&nbsp;

	// 		</span>
	// 	);
	// }

	renderWalletDetails() {
		const { classes } = this.props;

		const { statusDetails } = this.state;
		let connected = false;
		let detailArray = [];
		if (statusDetails) {
			connected = true;
			const { connections, tip } = statusDetails;
			const { height } = tip;

			detailArray = [
				<Typography variant="subheading">Peers: {connections}</Typography>,
				<Typography variant="subheading">Height: {height}</Typography>
			];
		}

		return (
			<div className={classes.details}>
				{connected ? <ConnectedIcon className={classes.icon} /> : null}
				<Typography variant="subheading">
					{connected ? "Connected" : "Connecting..."}
				</Typography>
				{connected ? (
					<div>
						{detailArray.map((detail, index) => (
							<span key={index}>{detail}</span>
						))}
					</div>
				) : null}
			</div>
		);
	}

	renderMenu() {
		const { classes } = this.props;
		return (
			<div className={classes.content}>
				<div>
					<Typography
						style={{ textAlign: "center" }}
						variant="display1"
						gutterBottom
					>
						Grin wallet
					</Typography>

					{this.renderWalletDetails()}
					{/* <Divider /> */}

					{/* <Button fullWidth component={Link} to="/">
						<WalletIcon className={classes.icon} /> Wallet
					</Button>

					<Button fullWidth component={Link} to="/transactions">
						<TransactionIcon className={classes.icon} /> Transactions
					</Button> */}
					<MenuItem to="/" icon={<WalletIcon className={classes.icon} />}>
						Wallet
					</MenuItem>

					{/* <MenuItem
						to="/transactions"
						icon={<TransactionIcon className={classes.icon} />}
					>
						Transactions
					</MenuItem> */}

					<MenuItem to="/peers" icon={<PeersIcon className={classes.icon} />}>
						Network peers
					</MenuItem>

					<MenuItem
						to="/contacts"
						icon={<ContactsIcon className={classes.icon} />}
					>
						Contacts
					</MenuItem>
				</div>

				<div>
					{/* <Divider /> */}
					<MenuItem to="/about" icon={<AboutIcon className={classes.icon} />}>
						About
					</MenuItem>
					<MenuItem
						to="/settings"
						icon={<SettingsIcon className={classes.icon} />}
					>
						Settings
					</MenuItem>
				</div>
			</div>
		);
	}

	render() {
		return (
			<List component="nav" style={{ flex: 1, display: "flex" }}>
				{this.renderMenu()}
			</List>
		);
	}
}

MenuContent.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuContent);

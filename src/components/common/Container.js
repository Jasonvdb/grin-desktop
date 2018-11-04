import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import MenuContent from "./MenuContent";
import ErrorDialog from "./ErrorDialog";

const drawerWidth = 240;

const styles = theme => ({
	root: {
		height: "100%",
		flex: 1,
		flexGrow: 1,
		zIndex: 1,
		overflow: "hidden",
		position: "relative",
		display: "flex",
		width: "100%",
		backgroundColor: theme.palette.background.default
	},
	drawerPaper: {
		width: drawerWidth,
		minHeight: "100%",
		position: "relative",
		backgroundColor: theme.palette.sidebar.default,
		borderStyle: "none"
	},
	content: {
		height: "94%",
		flexGrow: 1,
		padding: theme.spacing.unit * 2
	}
});

class Container extends React.Component {
	render() {
		const { classes, children } = this.props;

		const drawer = (
			<Drawer
				anchor="left"
				variant="permanent"
				classes={{
					paper: classes.drawerPaper
				}}
			>
				<MenuContent />
			</Drawer>
		);

		return (
			<div className={classes.root}>
				{drawer}
				<main className={classes.content}>{children}</main>
				<ErrorDialog />
			</div>
		);
	}
}

Container.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.element.isRequired
};

export default withStyles(styles)(Container);

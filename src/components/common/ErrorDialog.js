import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import { observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import grinServer from "../../stores/grinServer";
import grinWallet from "../../stores/grinWallet";

const Transition = props => {
	return <Slide direction="up" {...props} />;
};

const styles = theme => ({
	root: { padding: 20 },
	heading: {
		marginBottom: 20,
		color: "black"
	},
	text: {
		color: "black",
		userSelect: "auto"
	}
});

const ErrorDialog = observer(({ classes }) => {
	const open = grinServer.errorMessage || grinWallet.errorMessage;
	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={() => console.log("Close")}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
		>
			{grinServer.errorMessage ? (
				<div className={classes.root}>
					<Typography className={classes.heading} variant="h3">
						Grin server error:
					</Typography>

					<DialogContent>
						<DialogContentText className={classes.text}>
							{grinServer.errorMessage}
						</DialogContentText>
					</DialogContent>
				</div>
			) : null}

			{grinWallet.errorMessage ? (
				<div className={classes.root}>
					<Typography className={classes.heading} variant="h3">
						Grin wallet error:
					</Typography>

					<DialogContent>
						<DialogContentText className={classes.text}>
							{grinWallet.errorMessage}
						</DialogContentText>
					</DialogContent>
				</div>
			) : null}
		</Dialog>
	);
});

export default withStyles(styles)(ErrorDialog);

import React, { Component } from "react";
import { observer } from "mobx-react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

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
		textField: {}
	};
};

@observer
class Send extends Component {
	constructor(props) {
		super(props);

		this.state = { value: "", sendIp: "", sendPort: "13415" };
	}

	onSubmit(e) {
		e.preventDefault();

		const { sendIp, sendPort, value } = this.state;

		console.log("SendIP: ", sendIp);
		console.log("sendPort: ", sendPort);
	}

	renderForm() {
		const { classes } = this.props;
		const { value, sendIp, sendPort } = this.state;
		return (
			<form onSubmit={this.onSubmit.bind(this)} noValidate autoComplete="off">
				<TextField
					label="Value (Grin)"
					className={classes.textField}
					value={value}
					onChange={e => this.setState({ value: e.target.value })}
					margin="normal"
					variant="outlined"
				/>
				<div>
					<TextField
						label="IP address"
						className={classes.textField}
						value={sendIp}
						onChange={e => this.setState({ sendIp: e.target.value })}
						margin="normal"
						variant="outlined"
					/>
					<TextField
						label="Port"
						className={classes.textField}
						value={sendPort}
						onChange={e => this.setState({ sendPort: e.target.value })}
						margin="normal"
						variant="outlined"
					/>
				</div>
				<Button type="submit">Send</Button>
			</form>
		);
	}

	render() {
		const { classes } = this.props;
		const {
			isConnected,
			formattedTotal,
			formattedCurrentlySpendable
		} = grinWallet;

		return (
			<div className={classes.root}>
				<div className={classes.content}>
					<div>
						<Typography className={classes.text} variant="h2">
							{formattedTotal.base}
							<span className={classes.smallText}>
								. {formattedTotal.decimals}
							</span>
							<span style={{ marginLeft: 20 }} className={classes.smallText}>
								grin
							</span>
						</Typography>

						<Typography className={classes.text} variant="h5">
							{formattedCurrentlySpendable.base}
							<span className={classes.smallerText}>
								{formattedCurrentlySpendable.decimals
									? `. ${formattedCurrentlySpendable.decimals}`
									: ""}
							</span>
							<span style={{ marginLeft: 15 }} className={classes.smallerText}>
								spendable
							</span>
						</Typography>
					</div>
					{this.renderForm()}
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(Send);

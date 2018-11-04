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
		smallerText: {
			fontSize: theme.typography.h6.fontSize
		},
		textField: {}
	};
};

@observer
class Receive extends Component {
	constructor(props) {
		super(props);

		this.state = {
			localIP: ""
		};
	}

	//TODO move to shared function
	getUserIP(onNewIP) {
		//  onNewIp - your listener function for new IPs
		//compatibility for firefox and chrome
		var myPeerConnection =
			window.RTCPeerConnection ||
			window.mozRTCPeerConnection ||
			window.webkitRTCPeerConnection;
		var pc = new myPeerConnection({
				iceServers: []
			}),
			noop = function() {},
			localIPs = {},
			ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
			key;

		function iterateIP(ip) {
			if (!localIPs[ip]) onNewIP(ip);
			localIPs[ip] = true;
		}

		//create a bogus data channel
		pc.createDataChannel("");

		// create offer and set local description
		pc.createOffer()
			.then(function(sdp) {
				sdp.sdp.split("\n").forEach(function(line) {
					if (line.indexOf("candidate") < 0) return;
					line.match(ipRegex).forEach(iterateIP);
				});

				pc.setLocalDescription(sdp, noop, noop);
			})
			.catch(function(reason) {
				// An error occurred, so handle the failure to connect
			});

		//listen for candidate events
		pc.onicecandidate = function(ice) {
			if (
				!ice ||
				!ice.candidate ||
				!ice.candidate.candidate ||
				!ice.candidate.candidate.match(ipRegex)
			)
				return;
			ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
		};
	}

	componentDidMount() {
		this.getUserIP(localIP => {
			//alert("Got IP! :" + ip);
			this.setState({ localIP });
		});
	}

	render() {
		const { classes } = this.props;
		const { localIP } = this.state;
		const { formattedTotal, formattedAwaitingConfirmation } = grinWallet;

		return (
			<div className={classes.root}>
				<div className={classes.content}>
					<div>
						<Typography className={classes.text} variant="h2">
							{formattedTotal.base}
							<span className={classes.smallText}>
								{formattedTotal.decimals ? `. ${formattedTotal.decimals}` : ""}
							</span>
							<span style={{ marginLeft: 20 }} className={classes.smallText}>
								grin
							</span>
						</Typography>

						<Typography className={classes.text} variant="h5">
							{formattedAwaitingConfirmation.base}
							<span className={classes.smallerText}>
								{formattedAwaitingConfirmation.decimals
									? `. ${formattedAwaitingConfirmation.decimals}`
									: ""}
							</span>
							<span style={{ marginLeft: 15 }} className={classes.smallerText}>
								incoming grin
							</span>
						</Typography>
					</div>

					<Typography className={classes.text} variant="h2">
						<span className={classes.smallerText}>Listing at:</span>
						<br />
						{localIP}
						<span className={classes.smallText}>:13415</span>
					</Typography>
					{/* //TODO show IP */}
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(Receive);

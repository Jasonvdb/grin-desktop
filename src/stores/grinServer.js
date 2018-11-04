const { ipcRenderer } = window.require("electron");
import { observable, action, computed } from "mobx";
import formatValue from "../helpers/formatValue";

const STATUS_PATH = "/status";
const CONNECTED_PEERS_PATH = "/peers/connected";

class Server {
	@observable
	statusDetails = null;

	@observable
	connectedPeers = null;

	@observable
	errorMessage = null;

	constructor() {
		console.log("Listening for server state updates");
		ipcRenderer.on("grin-server-reply", (event, { path, result, error }) => {
			if (error) {
				console.error(error);
				this.errorMessage = error;
				return;
			}

			this.errorMessage = null;
			switch (path) {
				case STATUS_PATH:
					this.statusDetails = result;
					break;
				case CONNECTED_PEERS_PATH:
					this.connectedPeers = result;
					break;
			}
		});

		this.refreshStatus();
		this.refreshPeers();

		setInterval(() => {
			this.refreshStatus();
		}, 1000);

		setInterval(() => {
			this.refreshPeers();
		}, 10000);
	}

	refreshStatus() {
		ipcRenderer.send("grin-server-request", { path: STATUS_PATH });
	}

	refreshPeers() {
		ipcRenderer.send("grin-server-request", { path: CONNECTED_PEERS_PATH });
	}

	@computed
	get isConnected() {
		return this.statusDetails && this.statusDetails.connections > 0;
	}

	@computed
	get totalConnectedPeers() {
		return this.connectedPeers ? this.connectedPeers.length : 0;
	}

	@computed
	get isSyncing() {
		const progress = this.getSyncProgress;
		if (progress === false || progress.base < 99.9) {
			return true;
		}

		return false;
	}

	@computed
	get getSyncProgress() {
		const currentHeight = this.statusDetails
			? this.statusDetails.tip.height
			: 0;

		if (currentHeight <= 1) {
			return false;
		}

		if (this.connectedPeers && this.statusDetails) {
			//Get the average height of peers to see how far we are
			let totalHeightOfPeers = 0;
			this.connectedPeers.forEach(({ height }) => {
				totalHeightOfPeers = totalHeightOfPeers + height;
			});

			let averageHeight = totalHeightOfPeers / this.connectedPeers.length;

			let percentComplete = (currentHeight / averageHeight) * 100;
			if (percentComplete > 100) {
				percentComplete = 100.0;
			}
			[];
			const result = formatValue(percentComplete, 1, 1);
			return result;
		}

		return false; //Unknown state
	}
}

const grinServer = new Server();

export default grinServer;

const { ipcRenderer } = window.require("electron");
import { observable, action, computed } from "mobx";

const STATUS_PATH = "/status";
const CONNECTED_PEERS_PATH = "/peers/connected";

class Server {
	@observable
	statusDetails = null;

	@observable
	connectedPeers = null;

	constructor() {
		console.log("Listening for server state updates");
		ipcRenderer.on("grin-server-reply", (event, { path, result }) => {
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
		return !!this.statusDetails;
	}

	@computed
	get totalConnectedPeers() {
		return this.connectedPeers ? this.connectedPeers.length : 0;
	}
}

const grinServer = new Server();

export default grinServer;

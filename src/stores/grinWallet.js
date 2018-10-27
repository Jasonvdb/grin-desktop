const { ipcRenderer } = window.require("electron");
import { observable, action, computed } from "mobx";

class Wallet {
	@observable
	amount_awaiting_confirmation = null;

	@observable
	amount_currently_spendable = null;

	@observable
	amount_immature = null;

	@observable
	amount_locked = null;

	@observable
	last_confirmed_height = null;

	@observable
	total = null;

	constructor() {
		//Listen for updates
		console.log("Listening for wallet state updates");

		this.updateTimer = setInterval(() => {
			this.refreshInfo();
		}, 1000);

		ipcRenderer.on("grin-wallet-reply", (event, walletInfo) => {
			const {
				amount_awaiting_confirmation,
				amount_currently_spendable,
				amount_immature,
				amount_locked,
				last_confirmed_height,
				total
			} = walletInfo[1];

			this.amount_awaiting_confirmation = amount_awaiting_confirmation;
			this.amount_currently_spendable = amount_currently_spendable;
			this.amount_immature = amount_immature;
			this.amount_locked = amount_locked;
			this.last_confirmed_height = last_confirmed_height;
			this.total = total;
		});
	}

	refreshInfo() {
		ipcRenderer.send("grin-wallet-request", {
			path: "/wallet/owner/retrieve_summary_info?refresh"
		});
	}

	@computed
	get isConnected() {
		return !!this.total;
	}

	formatValue(value) {
		let result = {
			base: 0,
			decimals: null
		};

		if (value) {
			const decimalValue = `${value / 1000000000}`;
			const splitValues = decimalValue.split(".");
			result.base = splitValues[0];
			result.decimals = splitValues[1] || "0";
		}

		return result;
	}

	@computed
	get formattedTotal() {
		return this.formatValue(this.total);
	}

	@computed
	get formattedAwaitingConfirmation() {
		return this.formatValue(this.amount_awaiting_confirmation);
	}

	@computed
	get formattedCurrentlySpendable() {
		return this.formatValue(this.amount_currently_spendable);
	}

	@computed
	get formattedAmountImmature() {
		return this.formatValue(this.amount_immature);
	}

	@computed
	get formattedAmountLocked() {
		return this.formatValue(this.amount_locked);
	}
}

const grinWallet = new Wallet();

export default grinWallet;

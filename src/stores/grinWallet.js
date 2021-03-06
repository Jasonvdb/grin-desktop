const { ipcRenderer } = window.require("electron");
import { observable, action, computed } from "mobx";
import moment from "moment";
import formatValue from "../helpers/formatValue";

const BALANCES_PATH = "/wallet/owner/retrieve_summary_info?refresh";
const TRANSACTIONS_PATH = "/wallet/owner/retrieve_txs?refresh";

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

	@observable
	transactions = null;

	@observable
	errorMessage = null;

	constructor() {
		console.log("Listening for wallet state updates");
		this.refreshInfo();
		this.refreshTransactions();

		setInterval(() => {
			this.refreshInfo();
			this.refreshTransactions();
		}, 1000);

		ipcRenderer.on("grin-wallet-reply", (event, { path, result, error }) => {
			if (error) {
				console.error(error);
				this.errorMessage = error;
				return;
			}

			this.errorMessage = null;
			switch (path) {
				case BALANCES_PATH:
					this.updateBalances(result);
					break;
				case TRANSACTIONS_PATH:
					this.updateTransactions(result);
					break;
			}
		});
	}

	refreshInfo() {
		ipcRenderer.send("grin-wallet-request", {
			path: BALANCES_PATH
		});
	}

	refreshTransactions() {
		ipcRenderer.send("grin-wallet-request", {
			path: TRANSACTIONS_PATH
		});
	}

	updateBalances(balances) {
		const {
			amount_awaiting_confirmation,
			amount_currently_spendable,
			amount_immature,
			amount_locked,
			last_confirmed_height,
			total
		} = balances[1];

		this.amount_awaiting_confirmation = amount_awaiting_confirmation;
		this.amount_currently_spendable = amount_currently_spendable;
		this.amount_immature = amount_immature;
		this.amount_locked = amount_locked;
		this.last_confirmed_height = last_confirmed_height;
		this.total = total;
	}

	updateTransactions(transactions) {
		let formattedTransactions = [];
		transactions[1].forEach(tx => {
			let { amount_credited, amount_debited, creation_ts } = tx;

			let formattedAmountCredited = null;
			let formattedAmountDebited = null;

			//FIXME minus the debit from the credit and only display that number
			if (amount_credited > 0) {
				const { base, decimals } = formatValue(amount_credited);
				formattedAmountCredited = `${base}.${decimals}`;
			}

			if (amount_debited > 0) {
				const { base, decimals } = formatValue(amount_debited);
				formattedAmountDebited = `-${base}.${decimals}`;
			}

			const txTime = moment(creation_ts).format("MMMM Do YYYY, h:mm:ss a");

			formattedTransactions.push({
				...tx,
				formattedAmountCredited,
				formattedAmountDebited,
				txTime
			});
		});

		formattedTransactions.reverse();
		this.transactions = formattedTransactions;
	}

	@computed
	get isConnected() {
		return this.total !== null;
	}

	@computed
	get formattedTotal() {
		return formatValue(this.total);
	}

	@computed
	get formattedAwaitingConfirmation() {
		return formatValue(this.amount_awaiting_confirmation);
	}

	@computed
	get formattedCurrentlySpendable() {
		return formatValue(this.amount_currently_spendable);
	}

	@computed
	get formattedAmountImmature() {
		return formatValue(this.amount_immature);
	}

	@computed
	get formattedAmountLocked() {
		return formatValue(this.amount_locked);
	}
}

const grinWallet = new Wallet();

export default grinWallet;

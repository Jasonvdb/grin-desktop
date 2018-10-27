import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

const rowsPerPage = 5;

const styles = theme => ({
	root: {
		width: "100%",
		marginTop: theme.spacing.unit * 3
	},
	table: {},
	tableWrapper: {
		overflowX: "auto"
	}
});

class TransactionsTable extends Component {
	constructor(props) {
		super(props);

		this.state = { page: 0 };
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	render() {
		const { classes, transactions } = this.props;
		const { page } = this.state;
		const emptyRows =
			rowsPerPage -
			Math.min(rowsPerPage, transactions.length - page * rowsPerPage);

		return (
			<div className={classes.root}>
				<div className={classes.tableWrapper}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell>Time</TableCell>
								<TableCell numeric>Amount</TableCell>
								<TableCell>Status</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{transactions
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map(tx => {
									const {
										txTime,
										formattedAmountCredited,
										formattedAmountDebited,
										amount_credited,
										amount_debited,
										confirmation_ts,
										confirmed,
										creation_ts,
										fee,
										id,
										num_inputs,
										num_outputs,
										parent_key_id,
										tx_hex,
										tx_slate_id,
										tx_type
									} = tx;

									return (
										<TableRow key={id}>
											<TableCell component="th" scope="row">
												{txTime}
											</TableCell>
											<TableCell numeric>
												{formattedAmountCredited || formattedAmountDebited}
											</TableCell>
											<TableCell>
												{confirmed ? "Confirmed" : "Pending"}
											</TableCell>
										</TableRow>
									);
								})}

							{emptyRows > 0 && (
								<TableRow style={{ height: 48 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>

						<TableFooter>
							<TableRow>
								<TablePagination
									colSpan={3}
									count={transactions.length}
									rowsPerPage={rowsPerPage}
									page={page}
									onChangePage={this.handleChangePage}
									labelRowsPerPage={false}
									rowsPerPageOptions={[]}
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</div>
			</div>
		);
	}
}

TransactionsTable.propTypes = {
	classes: PropTypes.object.isRequired,
	transactions: PropTypes.array.isRequired
};

export default withStyles(styles)(TransactionsTable);

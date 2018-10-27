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

class PeersTable extends Component {
	constructor(props) {
		super(props);

		this.state = { page: 0 };
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	render() {
		const { classes, connectedPeers } = this.props;
		const { page } = this.state;
		const emptyRows =
			rowsPerPage -
			Math.min(rowsPerPage, connectedPeers.length - page * rowsPerPage);

		return (
			<div className={classes.root}>
				<div className={classes.tableWrapper}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell>Address</TableCell>
								<TableCell>Direction</TableCell>
								<TableCell>Height</TableCell>
								<TableCell>User agent</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{connectedPeers
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map(peer => {
									const {
										addr,
										capabilities,
										direction,
										height,
										total_difficulty,
										user_agent,
										version
									} = peer;

									return (
										<TableRow key={addr}>
											<TableCell component="th" scope="row">
												{addr}
											</TableCell>
											<TableCell>{direction}</TableCell>

											<TableCell numeric>{height}</TableCell>
											<TableCell>{user_agent}</TableCell>
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
									count={connectedPeers.length}
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

PeersTable.propTypes = {
	classes: PropTypes.object.isRequired,
	connectedPeers: PropTypes.array.isRequired
};

export default withStyles(styles)(PeersTable);

export default (value, toFixed = 8, base = 1000000000) => {
	let result = {
		base: "0",
		decimals: null
	};

	if (value) {
		const decimalValue = `${(value / base).toFixed(toFixed)}`;
		const splitValues = decimalValue.split(".");
		result.base = splitValues[0];
		result.decimals = splitValues[1] || "0";
	}

	return result;
};

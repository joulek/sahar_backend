
const outputConsole = async (label, error) => {
    const result = error ? 'failed' : 'success';
    const status = error ? 500 : 200;
    const errorMessage = error ? ` ${error.message}` : '';
    console.log(`request sent from ${label} with status ${status}: ${result}!${errorMessage}`);
};
module.exports = { outputConsole };



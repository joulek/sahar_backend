const trycatch = async (command, params = undefined, browserResponse) => {
    try {
    browserResponse.status(200).send(await command(params));
    return params;
    } catch (error) {
        console.log(error);
    browserResponse.status(500).send(error.message);
    }
    };
module.exports = { trycatch };
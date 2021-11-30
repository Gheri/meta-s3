// RFC Standards
const errorResponse = (code, message, errors) => {
    return {code, message, errors};
}

module.exports = errorResponse;
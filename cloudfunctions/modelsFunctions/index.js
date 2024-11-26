const updateShare = require('./updateShare/index');
exports.main = async (event, context) => {
    switch (event.type) {
        case 'updateShare':
            return await updateShare.main(event, context);
    }
}
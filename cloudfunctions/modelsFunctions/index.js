const updateShare = require('./updateShare/index');
const handleShare = require('./handleShare/index');
const getShareList = require('./getShareList/index');

exports.main = async (event, context) => {
    switch (event.type) {
        case 'updateShare':
            return await updateShare.main(event, context);
        case 'handleShare':
            return await handleShare.main(event, context);
        case 'getShareList':
            return await getShareList.main(event, context);


    }
}
const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const $ = db.command.aggregate
const _ = db.command
exports.main = async (event, context) => {
    try {
        let shopId = event?.entity
        let match = {
            type: _.neq(1)
        }
        if (shopId) {
            match.shopId = shopId
        }
        return db.collection('bill')
            .aggregate()
            .match(match)
            .group({
                _id: null,
                total: $.sum('$money')
            })
            .end()
    } catch (error) {
        return {
            success: false,
            errMsg: error
        }
    }
};
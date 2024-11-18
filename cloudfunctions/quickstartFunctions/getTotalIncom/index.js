const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const $ = db.command.aggregate
const _ = db.command
exports.main = async (event, context) => {
    try {
        let shopId = event?.entity?.shopId
        /**
         * type:0,会员充值；1,会员消费；2,微信消费；3,店铺支出
         */
        let match = {
            // type: _.neq(1)
        }
        if (shopId) {
            match.shopId = shopId
        }
        return db.collection('bill')
            .aggregate()
            .match(match)
            .group({
                _id: '$type',
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
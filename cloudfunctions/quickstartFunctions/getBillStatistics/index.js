const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const $ = db.command.aggregate
exports.main = async (event, context) => {
    try {
        let {
            shopId,
            type
        } = event.entity

        if (!shopId) {
            return {
                success: false,
                errMsg: 'shopId is null'
            }
        }
        if (type != 0 && !type) {
            return {
                success: false,
                errMsg: 'type is null'
            }
        }
        return db.collection('bill')
            .aggregate()
            .match({
                type,
                shopId
            })
            .project({
                money: '$money',
                month: $.month('$createDate')
            })
            .group({
                _id: '$month',
                money: $.sum('$money'),
                num: $.sum(1)
            })
            .end()
    } catch (error) {
        return {
            success: false,
            errMsg: error
        }
    }
};
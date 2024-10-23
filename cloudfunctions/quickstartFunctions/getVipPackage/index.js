const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const $ = db.command.aggregate
exports.main = async (event, context) => {
    return db.collection('vipPackage')
        .aggregate()
        .match({
            isDelete: false
        })
        .sort({
            price: 1
        })
        .lookup({
            from: 'coupon',
            localField: 'coupon',
            foreignField: '_id',
            as: 'coupon',
        })
        .end()
};
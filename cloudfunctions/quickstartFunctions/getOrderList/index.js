const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
    let entity = event.entity
    // const _openid = cloud.getWXContext().OPENID
    if (!entity.shopId) {
        return {
            success: false,
            errMsg: "shopId is null"
        }
    }
    entity.isDelete = false
    return await db.collection('order')
        .aggregate()
        .match(entity)
        .sort({
            createDate: -1,
        })
        .lookup({
            from: 'tableSeats',
            localField: 'tableSeatsId',
            foreignField: '_id',
            as: 'tableSeats',
        })
        .end()
};
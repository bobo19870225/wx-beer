const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// const $ = db.command.aggregate
exports.main = async (event, context) => {
    const where = {
        isDelete: false,
    }
    // ================== 分页参数END ===========================
    return db.collection('vipPackage')
        .aggregate()
        .match(where)
        .sort({
            price: 1
        })
        .lookup({
            from: 'coupon',
            let: {
                vip_coupon: '$coupon',
            },
            pipeline: $.pipeline()
                .match({
                    author: 'author 3'
                })
                .done(),
            as: 'coupon',
        })
        .end()
};
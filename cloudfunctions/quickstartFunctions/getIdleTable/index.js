const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const $ = db.command.aggregate
const _ = db.command
exports.main = async (event, context) => {
    const entity = event.entity
    const shopId = entity.shopId
    // const _openid = cloud.getWXContext().OPENID
    if (!shopId) {
        return {
            success: false,
            errMsg: "shopId is null"
        }
    }
    return await db.collection('tableSeats')
        .aggregate()
        .match({
            isDelete: false,
            shopId
        })
        .lookup({
            from: 'order',
            let: {
                tableSeats_id: '$_id',
            },
            pipeline: $.pipeline()
                .match(
                    _.expr(
                        $.and([
                            $.eq(['$tableSeatsId', '$$tableSeats_id']),
                            $.or([$.eq(['$state', 1]), $.eq(['$state', 2])])
                        ])
                    )
                )
                .done(),
            as: 'goodsList',
        })
        .addFields({
            isIdle: $.size('$goodsList'),
        })
        .project({
            goodsList: 0,
        })
        .sort({
          isIdle: 1
        })
        .end()
};
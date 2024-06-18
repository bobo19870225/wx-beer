const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
    const _openid = cloud.getWXContext().OPENID
    return db.collection('user')
        .aggregate()
        .match({
            isDelete: false,
            _openid
        })
        .lookup({
            from: 'vip',
            localField: '_openid',
            foreignField: '_openid',
            as: 'vipList',
        })
        .end()
};
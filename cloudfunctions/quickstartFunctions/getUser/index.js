const cloud = require('wx-server-sdk');

cloud.init({
    env: 'beer-1g75udik38f745cf'
});
const db = cloud.database();
exports.main = async (event, context) => {
    const _openid = event._openid
    if (!_openid) {
        return {
            success: false,
            errMsg: "_openid is null"
        }
    }
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
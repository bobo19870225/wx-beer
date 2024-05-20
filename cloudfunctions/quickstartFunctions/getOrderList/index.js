const cloud = require('wx-server-sdk');
cloud.init({
    env: 'beer-1g75udik38f745cf'
});
const db = cloud.database();
exports.main = async (event, context) => {
    let {
        shopId,
        _openid
    } = event
    return await db.collection('order').where({
        shopId,
        _openid
    }).orderBy('createDate', 'desc').get();
};
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
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
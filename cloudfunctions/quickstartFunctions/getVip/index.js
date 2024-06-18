const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  const shopId = event.shopId
  const _openid = event._openid
  if (!shopId) {
    return {
      success: false,
      errMsg: 'shopId不能为空'
    }
  }
  if (!_openid) {
    return {
      success: false,
      errMsg: '_openid不能为空'
    }
  }
  let res = await db.collection('vip').where({
    isDelete: false,
    shopId,
    _openid
  }).get();
  return {
    success: true,
    result: res
  }
};
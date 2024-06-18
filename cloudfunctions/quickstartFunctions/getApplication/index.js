const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  const where = event.where
  const shopId = where.shopId
  const state = where.state
  if (!shopId) {
    return {
      success: false,
      rusult: '参数不完整'
    };
  }
  const res = await db.collection('task').where({
    shopId,
    state
  }).get();
  return {
    success: true,
    data: res.data
  };
};
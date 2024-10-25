const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();


// 聚合记录云函数入口函数
exports.main = async (event, context) => {
  try {
    let entity = event.entity
    const id = entity._id
    let res = null
    if (id) {
      delete entity._id
      entity.updateDate = Date.now()
      res = await db.collection('coupon').doc(id).update({
        data: entity,
      });
    } else {
      entity.createDate = Date.now()
      res = await db.collection('coupon').add({
        data: entity
      });
    }
    return {
      success: true,
      rusult: res
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();


// 聚合记录云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.id) {
      await db.collection('shop').doc(event.id).update({
        data: event.data,
      });
    } else {
      await db.collection('shop').add({
        data: event.data,
      });
    }
    return {
      success: true,
      data: event.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();


// 聚合记录云函数入口函数
exports.main = async (event, context) => {
  try {
    const entity = event.entity
    const shopId = entity.shopId
    if (!shopId) {
      return {
        success: false,
        errMsg: 'shopId is null'
      };
    }
    const wxContext = cloud.getWXContext();
    entity._openid = wxContext.OPENID
    entity.createDate = new Date()
    const isDelete = entity.isDelete
    if (isDelete == null || isDelete == undefined) {
      entity.isDelete = false
    }
    const id = entity._id
    let res = null
    if (id) {
      delete entity._id
      res = await db.collection('spend').doc(id).update({
        data: entity,
      });
    } else {
      res = await db.collection('spend').add({
        data: entity,
      });
    }
    const data = res.data || res
    return {
      success: true,
      rusult: data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
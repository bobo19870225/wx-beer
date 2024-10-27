const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  try {
    let entity = event.entity
    const id = entity._id
    let res = null
    if (id) {
      delete entity._id
      entity.updateDate = Date.now()
      res = await db.collection('user').doc(id).update({
        data: entity
      });
    } else {
      entity.createDate = Date.now()
      res = await db.collection('user').add({
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
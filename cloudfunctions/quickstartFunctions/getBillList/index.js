const cloud = require('wx-server-sdk');
cloud.init({
  env: 'beer-1g75udik38f745cf'
});
const db = cloud.database();
exports.main = async (event, context) => {
  try {
    let {
      shopId,
      _openid
    } = event.entity
    let where = {}
    if (shopId) {
      where.shopId = shopId
    }
    if (_openid) {
      where._openid = _openid
    }
    res = await db.collection('bill').where(where).orderBy('createDate', 'desc').get();
    const data = res.data
    return {
      success: true,
      data
    }
  } catch (error) {
    return {
      success: false,
      errMsg: error
    }
  }

};
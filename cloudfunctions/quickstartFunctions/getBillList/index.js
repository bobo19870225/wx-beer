const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  try {
    let {
      shopId,
      _openid,
    } = event.entity

    let {
      pageNumber,
      pageSize
    } = event.page
    if (!pageNumber || pageNumber < 1) {
      pageNumber = 1
    }
    if (!pageSize || pageSize < 1 || pageSize > 100) {
      pageSize = 100 //非法值设为最大值
    }

    let where = {}
    if (shopId) {
      where.shopId = shopId
    }
    if (_openid) {
      where._openid = _openid
    }
    res = await db.collection('bill')
      .where(where)
      .orderBy('createDate', 'desc')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .get();
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
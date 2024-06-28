const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
/**
 * 进行中的订单state=1（已付款） or state=2(已上菜)
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
  let entity = event.entity
  if (!entity.shopId) {
    return {
      success: false,
      errMsg: "shopId is null"
    }
  }
  // ================== 分页参数 ==============================
  const page = event.page
  let pageNumber = 1
  let pageSize = 100
  if (page && page.pageNumber && page.pageNumber > 1) {
    pageNumber = page.pageNumber
  }
  if (page && page.pageSize && page.pageSize > 0 && page.pageSize < 100) {
    pageSize = page.pageSize //非法值设为最大值
  }
  // ================== 分页参数END ===========================
  const res = await db.collection('order')
    .where({
      isDelete: false,
      shopId: entity.shopId,
      state: _.eq(1).or(_.eq(2))
    })
    .orderBy('state', 'desc')
    .orderBy('updateDate', 'asc')
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .get()
  return {
    success: true,
    data: res.data
  }
};
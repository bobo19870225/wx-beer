const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  let entity = event.entity
  // const _openid = cloud.getWXContext().OPENID
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
  // 厨师看正序的
  let sort = -1
  if (entity.state == 1) {
    sort = 1
  }
  // ================== 分页参数END ===========================
  entity.isDelete = false
  return await db.collection('order')
    .aggregate()
    .match(entity)
    .sort({
      createDate: sort,
    })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .lookup({
      from: 'tableSeats',
      localField: 'tableSeatsId',
      foreignField: '_id',
      as: 'tableSeats',
    })
    .end()
};
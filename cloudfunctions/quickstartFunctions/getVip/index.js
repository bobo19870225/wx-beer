const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const $ = db.command.aggregate
exports.main = async (event, context) => {
  const entity = event.entity
  const shopId = entity?.shopId
  const _openid = entity?._openid
  const where = {
    isDelete: false,
  }
  if (shopId) {
    where.shopId = shopId
  }
  if (_openid) {
    where._openid = _openid
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
  return db.collection('vip')
    .aggregate()
    .match(where)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .lookup({
      from: 'user',
      localField: '_openid',
      foreignField: '_openid',
      as: 'userList',
    })
    .lookup({
      from: 'user',
      localField: '_openid',
      foreignField: '_openid',
      as: 'userList',
    })
    .project({
      _openid: 1,
      account: 1,
      updateDate: 1,
      user: $.arrayElemAt(['$userList', 0]),
    })
    .end()
};
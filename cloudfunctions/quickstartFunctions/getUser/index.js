const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
exports.main = async (event, context) => {
  const _openid = cloud.getWXContext().OPENID
  const shopId = event.entity?.shopId

  return db.collection('user')
    .aggregate()
    .match({
      isDelete: false,
      _openid
    })
    .lookup({
      from: 'vip',
      let: {
        user_openid: '$_openid',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$_openid', '$$user_openid']),
          $.eq(['$shopId', shopId]),
          $.eq(['$isDelete', false])
        ])))
        .done(),
      as: 'vipList',
    })
    .end()
};
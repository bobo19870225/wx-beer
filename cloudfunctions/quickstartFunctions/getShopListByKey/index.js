const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
const $ = db.command.aggregate
exports.main = async (event, context) => {
  const keyWords = event.entity.keyWords
  return db.collection('shop')
    .aggregate()
    .match({
      isDelete: false
    })
    .lookup({
      from: 'goods',
      let: {
        shop_id: '$_id',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$shopId', '$$shop_id']),
          $.gt([$.indexOfBytes(['$title', keyWords]), -1])
        ])))
        .done(),
      as: 'goodsList',
    })
    .match(_.expr($.gt([$.size('$goodsList'), 0])))
    .project({
      _id: 1,
      name: 1,
      latitude: 1,
      longitude: 1,
      remarks: 1,
    })
    .end()
};
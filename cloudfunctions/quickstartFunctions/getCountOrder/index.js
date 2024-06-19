const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const $ = db.command.aggregate
const _ = db.command
exports.main = async (event, context) => {
  try {
    let shopId = event?.entity?.shopId
    let match = {
      type: _.or(_.eq(1), _.eq(2))
    }
    if (shopId) {
      match.shopId = shopId
    }
    return db.collection('bill')
      .aggregate()
      .match(match)
      .group({
        _id: null,
        count: $.sum(1)
      })
      .project({
        _id: 0,
      })
      .end()
  } catch (error) {
    return {
      success: false,
      errMsg: error
    }
  }
};
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database({
  throwOnNotFound: true,
});
exports.main = async (event, context) => {
  try {
    const _ = db.command
    const entity = event.entity
    const _openid = cloud.getWXContext().OPENID
    const name = entity.name
    const shopId = entity.shopId
    const entry = entity.entry
    const price = entity.price
    const coupon = entity.coupon
    const vipPackageId = entity.vipPackageId
    if (!_openid || !shopId || !entry || !coupon || !price || !vipPackageId) {
      return {
        success: false,
        errMsg: '参数不完整:' + JSON.stringify(entity)
      };
    }
    const vipRes = await db.collection('vip').where({
      _openid,
      shopId
    }).get()
    const vipData = vipRes.data
    let vipId = null
    if (vipData && vipData.length > 0) {
      vipId = vipRes.data[0]._id
    }
    const result = await db.runTransaction(async transaction => {
      let res = null
      if (vipId) {
        res = await transaction.collection('vip').doc(vipId).update({
          data: {
            name,
            account: {
              recharge: _.inc(price),
              balance: _.inc(entry),
              coupon: coupon,
            },
            updateDate: new Date(),
            isDelete: false
          }
        })
      } else {
        res = transaction.collection('vip').add({
          data: {
            _openid,
            name,
            shopId,
            account: {
              recharge: price,
              balance: entry,
              coupon: coupon,
            },
            createDate: new Date(),
            isDelete: false
          }
        })
      }
      if (res) {
        const billAdd = await transaction.collection('bill').add({
          data: {
            _openid,
            createDate: new Date(),
            remarks: 'vip充值',
            vipPackageId,
            money: price,
            shopId,
            type: 0,
          }
        })
        if (!billAdd) {
          await transaction.rollback(-100)
        }
      } else {
        await transaction.rollback(-100)
      }
    })
    return {
      success: true,
      msg: result,
    }
  } catch (e) {
    return {
      success: false,
      errMsg: JSON.stringify(e)
    }
  }
};
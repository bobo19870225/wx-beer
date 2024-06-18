const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();


// 聚合记录云函数入口函数
exports.main = async (event, context) => {
  try {
    const entity = event.entity
    const shopId = entity.shopId
    if (!shopId) {
      return {
        success: false,
        errMsg: 'shopId is null'
      };
    }
    const wxContext = cloud.getWXContext();


    const isDelete = entity.isDelete
    if (isDelete == null || isDelete == undefined) {
      entity.isDelete = false
    }

    const result = await db.runTransaction(async transaction => {
      const id = entity._id
      let res = null
      if (id) {
        delete entity._id
        entity.updateOpenid = wxContext.OPENID
        entity.updateDate = new Date()
        res = await transaction.collection('spend').doc(id).update({
          data: entity,
        });
        const billAdd = await transaction.collection('bill').add({
          data: {
            _openid: wxContext.OPENID,
            createDate: new Date(),
            remarks: '店铺支出',
            money: -total,
            shopId,
            type: 3,
          }
        })
        if (!billAdd) {
          await transaction.rollback(-100)
        }
      } else {
        const listSpend = entity.listSpend
        let total = 0
        listSpend.forEach(element => {
          total += element.money
        });
        // 入账
        const billAdd = await transaction.collection('bill').add({
          data: {
            _openid: wxContext.OPENID,
            createDate: new Date(),
            remarks: '店铺支出',
            money: -total,
            shopId,
            type: 3,
          }
        })
        if (!billAdd) {
          await transaction.rollback(-100)
        }
        entity.createDate = new Date()
        entity._openid = wxContext.OPENID
        res = await transaction.collection('spend').add({
          data: entity,
        });
      }
    })
    return {
      success: true,
      rusult
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
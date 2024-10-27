const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

/**
 * 设置店长
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
  try {
    const entity = event.entity
    const shopId = entity.shopId
    const taskId = entity._id
    const taskOpenid = entity._openid
    const wxContext = cloud.getWXContext();
    const _openid = wxContext.OPENID
    if (!shopId) {
      return {
        success: false,
        errMsg: 'shopId is null'
      }
    }
    if (!taskOpenid) {
      return {
        success: false,
        errMsg: 'taskOpenid is null'
      }
    }
    if (!taskId) {
      return {
        success: false,
        errMsg: 'taskId is null'
      }
    }

    const resUser = await db.collection('user').where({
      _openid: taskOpenid
    }).get()
    const userList = resUser.data
    let user = null
    let manageShopIds = null
    if (userList && userList.length > 0) {
      user = userList[0]
      manageShopIds = user.manageShopIds || []
      if (manageShopIds.indexOf(shopId) === -1) {
        manageShopIds.push(shopId);
      }
    } else {
      return {
        success: false,
        errMsg: 'user not found'
      }
    }
    const result = await db.runTransaction(async transaction => {
      const resUpdateUser = await transaction.collection('user').doc(user._id).update({
        data: {
          manageShopIds,
          updateDate: Date.now(),
          updateOpenId: _openid
        }
      })
      if (!resUpdateUser) {
        await transaction.rollback(-100)
      }
      const resUpdateTask = await transaction.collection('task').doc(taskId).update({
        data: {
          state: 1, //审核通过
          updateDate: Date.now(),
          updateOpenId: _openid
        }
      })
      if (!resUpdateTask) {
        await transaction.rollback(-200)
      }
    })
    return {
      success: true,
      result
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取openId云函数入口函数
exports.main = async (event, context) => {
    const activityId = cloud.openapi.updatableMessage.createActivityId()
    return activityId
};
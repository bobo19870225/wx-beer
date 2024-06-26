const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  const where = event.entity 
  const res = await db.collection('task').where(where).orderBy('createDate','desc').get();
  return {
    success: true,
    data: res.data
  };
};
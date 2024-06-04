const cloud = require('wx-server-sdk');

cloud.init({
  env: 'beer-1g75udik38f745cf'
});
const db = cloud.database();
exports.main = async (event, context) => {
  return await db.collection('user').where({
    isDelete: false,
    _openid: event._openid
  }).get();
};
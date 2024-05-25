const cloud = require('wx-server-sdk');

cloud.init({
    env: 'beer-1g75udik38f745cf'
});
const db = cloud.database();


// 聚合记录云函数入口函数
exports.main = async (event, context) => {
    try {
        if (event.id) {
            await db.collection('order').doc(event.id).update({
                data: event.data,
            });
        } else {
            await db.collection('order').add({
                data: event.data,
            });
        }
        return {
            success: true,
            data: event.data
        };
    } catch (e) {
        return {
            success: false,
            errMsg: e
        };
    }
};
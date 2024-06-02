const cloud = require('wx-server-sdk');

cloud.init({
    env: 'beer-1g75udik38f745cf'
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
    try {
        if (event.id) {
            await db.collection('tableSeats').doc(event.id).update({
                data: event.data,
            });
        } else {
            await db.collection('tableSeats').add({
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
const cloud = require('wx-server-sdk');

cloud.init({
    env: 'beer-1g75udik38f745cf'
});
const db = cloud.database();


// 聚合记录云函数入口函数
exports.main = async (event, context) => {
    try {
        let res = null
        if (event.id) {
            res = await db.collection('vipPackage').doc(event.id).update({
                data: event.data,
            });
        } else {
            res = await db.collection('vipPackage').add({
                data: event.data,
            });
        }
        return {
            success: true,
            result: res
        };
    } catch (e) {
        return {
            success: false,
            errMsg: e
        };
    }
};
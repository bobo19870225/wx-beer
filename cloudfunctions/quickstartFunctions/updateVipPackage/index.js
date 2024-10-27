const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();


// 聚合记录云函数入口函数
exports.main = async (event, context) => {
    try {
        let res = null
        if (event.id) {
            event.data.updateDate = new Date()
            res = await db.collection('vipPackage').doc(event.id).update({
                data: event.data,
            });
        } else {
            event.data.createDate = new Date()
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
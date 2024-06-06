const cloud = require('wx-server-sdk');

cloud.init({
    env: 'beer-1g75udik38f745cf'
});
const db = cloud.database();


// 聚合记录云函数入口函数
exports.main = async (event, context) => {
    try {
        const entity = event.entity
        const id = entity._id
        let res = null
        if (id) {
            delete entity._id
            res = await db.collection('order').doc(id).update({
                data: entity,
            });
        } else {
            res = await db.collection('order').add({
                data: entity,
            });
        }
        const data = res.data
        return {
            success: true,
            data
        };
    } catch (e) {
        return {
            success: false,
            errMsg: e
        };
    }
};
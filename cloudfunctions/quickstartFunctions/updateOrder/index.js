const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 聚合记录云函数入口函数
exports.main = async (event, context) => {
    try {
        const entity = event.entity
        const id = entity._id
        const tableSeatsId = entity.tableSeatsId
        let res = null
        const isDelete = entity.isDelete
        entity._openid = cloud.getWXContext().OPENID
        if (id) {
            if (entity.state == 2 && entity.addTimes == 0 && tableSeatsId) { //上菜,非加菜
                const resSC = await db.collection('order')
                    .aggregate()
                    .match({
                        tableSeatsId,
                        state: 2
                    })
                    .count('total')
                    .end()
                if (resSC.list.length > 0) {
                    return {
                        success: false,
                        errMsg: "该桌用餐中..."
                    }
                }
            }
            if (isDelete) { //删除
                res = await db.collection('order').doc(id).update({
                    data: {
                        isDelete,
                        deleteDate: Date.now()
                    }
                });
            } else { //全量更新
                delete entity._id
                entity.updateDate = Date.now()
                res = await db.collection('order').doc(id).update({
                    data: entity,
                });
            }
        } else {
            entity.createDate = Date.now()
            entity.isDelete = false
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
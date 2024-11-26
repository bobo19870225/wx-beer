const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
    try {
        let entity = event.entity
        const id = entity._id
        let res = null
        if (id) {
            delete entity._id
            entity.updateDate = Date.now()
            res = await db.collection('share').doc(id).update({
                data: entity,
            });
        } else {
            const wxContext = cloud.getWXContext()
            const openid = wxContext.OPENID
            entity.shareID = openid
            entity.isReward = false
            entity.state = 0 //发送
            entity.reason = '被分享人还没有点击'
            entity.createDate = Date.now()
            entity.isDelete = false
            res = await db.collection('share').add({
                data: entity
            });
        }
        res.success = true
        return res;
    } catch (e) {
        return {
            success: false,
            errMsg: e
        };
    }
};
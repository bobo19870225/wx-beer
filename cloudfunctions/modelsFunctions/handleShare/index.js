const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
    try {
        const shareID = event.shareID
        const sharedID = event.sharedID
        const activityId = event.activityId
        let res = null
        if (shareID && sharedID && activityId) {
            const vipRes = await db.collection('vip').where({
                _openid: sharedID,
            }).get()
            const vip = vipRes.data
            // 0：已发起，被邀请人未进入小程序 1：被邀请人已是VIP用户 2：被邀请人完成未充值 3：被邀请人完成充值
            let state = 0
            let reason = ''
            if (vip) { //已是VIP
                state = 1
                reason = '被邀请人已是VIP用户,本次邀请无效'
            } else { // 2：被邀请人完成未充值
                state = 2
                reason = '被邀请人完成未充值,被邀请人完成充值后自动发放福利'
            }
            const shareRes = await db.collection('share').where({
                shareID,
            }).get()
            const entity = shareRes.data
            if (entity && entity._id) {
                const id = entity._id
                res = await db.collection('share').doc(id).update({
                    data: {
                        updateDate: Date.now(),
                        sharedID,
                        state,
                        reason
                    },
                });
                res.success = true
                return res;
            }
        }
        let errMsg = ''
        if (!shareID) {
            errMsg = '分享人为空'
        }
        if (!sharedID) {
            errMsg = '被分享人为空'
        }
        if (!activityId) {
            errMsg = 'activityId为空'
        }
        return {
            success: false,
            errMsg
        };
    } catch (e) {
        return {
            success: false,
            errMsg: e
        };
    }
};
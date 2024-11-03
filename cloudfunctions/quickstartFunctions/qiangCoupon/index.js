const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();


/**
 * 抢会员券
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    try {
        let entity = event.entity
        const id = entity._id
        const shopId = event.shopId
        if (!shopId) {
            return {
                success: false,
                errMsg: 'shopId为空'
            };
        }
        const _openid = cloud.getWXContext().OPENID

        if (id) {
            const vipRes = await db.collection('vip').where({
                _openid,
                shopId
            }).get()
            const vipData = vipRes.data
            let vip = null
            let vipId = null
            if (vipData && vipData.length > 0) {
                vip = vipRes.data[0]
                vipId = vipRes.data[0]._id
            }
            let coupon = vip.account.coupon
            for (let index = 0; index < coupon.length; index++) {
                const element = coupon[index];
                if (element._id == id) {
                    return {
                        success: false,
                        errMsg: '不能重复领取'
                    };
                }
            }

            delete entity._id
            entity.updateDate = Date.now()
            if (entity.releaseNumber >= 0 && entity.hasReleaseNumber && entity.hasReleaseNumber >= entity.releaseNumber) {
                return {
                    success: false,
                    errMsg: '抱歉，已抢光'
                };
            }
            entity.hasReleaseNumber = entity.hasReleaseNumber ? entity.hasReleaseNumber + 1 : 1
            const result = await db.runTransaction(async transaction => {
                const resCoupon = await transaction.collection('coupon').doc(id).update({
                    data: entity
                })
                if (!resCoupon) {
                    await transaction.rollback(-100)
                }
                const couponLogAdd = await transaction.collection('couponLog').add({
                    data: {
                        _openid,
                        createDate: new Date(),
                        couponId: id,
                        // shopId,
                    }
                })
                if (!couponLogAdd) {
                    await transaction.rollback(-200)
                }
                const resCouponGet = await transaction.collection('coupon').doc(id).get()
                let couponAdd = resCouponGet.data
                couponAdd.number = 1
                coupon.push(couponAdd)
                const vipRes = await transaction.collection('vip').doc(vipId).update({
                    data: {
                        account: {
                            coupon
                        },
                        updateDate: Date.now(),
                    }
                })
            })
            if (!vipRes) {
                await transaction.rollback(-300)
            }
            return {
                success: true,
                data: result,
            }
        } else {
            return {
                success: false,
                errMsg: 'id不能为空'
            };
        }

    } catch (e) {
        return {
            success: false,
            errMsg: e
        };
    }
};
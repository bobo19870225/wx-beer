const cloud = require('wx-server-sdk');
cloud.init({
    env: 'beer-1g75udik38f745cf'
});
const db = cloud.database({
    throwOnNotFound: false,
});
exports.main = async (event, context) => {
    /**
     *  entity.payType = payType
     *  entity.tableSeatsId = tableSeatsId //桌位
     *  entity.total = total
     *  entity.remarks = remarks
     *  entity.dinersNumb = that.data.dinersNumb //用餐人数              
     */
    try {
        const _ = db.command
        const entity = event.entity
        const orderId = entity._id
        const _openid = entity._openid
        const shopId = entity.shopId
        const total = entity.total
        const payType = entity.payType
        if (!orderId || !_openid || !shopId || !total || !payType) {
            return {
                success: false,
                errMsg: '参数不完整'
            };
        }
        // _openid 和 shopId 确定一条记录

        let vipId = null
        if (payType == 1) {
            const vipRes = await db.collection('vip').where({
                _openid,
                shopId
            }).get()
            const vipData = vipRes.data
            let account = null
            if (vipData && vipData.length > 0) {
                vipId = vipRes.data[0]._id
                const vip = vipRes.data[0]
                vipId = vip._id
                account = vip.account
            }

            // 余额不足
            if (account.balance - total < 0) {
                return {
                    success: false,
                    errMsg: '余额不足'
                }
            }
        }
        const result = await db.runTransaction(async transaction => {
            let accountRes = null
            if (payType == 0) { //普通支付

            } else if (payType == 1) { //VIP支付
                accountRes = await transaction.collection('vip').doc(vipId).update({
                    data: {
                        account: {
                            balance: _.inc(-total)
                        },
                        updateDate: new Date(),
                    }
                })
            }

            entity.updateDate = new Date()
            entity.state = 1 // 付款成功
            delete entity._id
            delete entity.goodsList
            const resOrder = await transaction.collection('order').doc(orderId).update({
                data: entity
            })
            if (resOrder && accountRes) {
                const billAdd = await transaction.collection('bill').add({
                    data: {
                        _openid,
                        createDate: new Date(),
                        remarks: '店内消费',
                        orderId,
                        money: -total,
                        shopId,
                        type: 1,
                    }
                })
                if (!billAdd) {
                    await transaction.rollback(-100)
                }
            } else {
                await transaction.rollback(-100)
            }
        })
        return {
            success: true,
            data: result,
        }
    } catch (e) {
        return {
            success: false,
            errMsg: e
        }
    }
};
const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();


// 聚合记录云函数入口函数
exports.main = async (event, context) => {
    try {
        const entity = event.entity
        const shopId = entity.shopId
        const shopName = entity.shopName
        if (!shopId) {
            return {
                success: false,
                errMsg: 'shopId is null'
            };
        }
        const wxContext = cloud.getWXContext();
        const isDelete = entity.isDelete
        if (isDelete == null || isDelete == undefined) {
            entity.isDelete = false
        }
        let nameArr = []
        let total = 0
        const result = await db.runTransaction(async transaction => {
            const id = entity._id
            let res = null
            const listSpend = entity.listSpend
            let names = ''
            listSpend.map(element => {
                element.money = Number.parseFloat(element.money)
                element.price = Number.parseFloat(element.price)
                element.number = Number.parseFloat(element.number)
                total += element.money
                if (names.length + element.name.length < 19) {
                    nameArr.push(element.name)
                    names = nameArr.join()
                }
                return element
            });
            entity.listSpend = listSpend
            entity.total = total
            if (id) {
                delete entity._id
                entity.updateOpenId = wxContext.OPENID
                entity.updateDate = Date.now()
                res = await transaction.collection('spend').doc(id).update({
                    data: entity,
                });
                res = await transaction.collection('spend').doc(id).get();
                if (!res || !res.data.billId) {
                    await transaction.rollback(-100)
                }
                const billAdd = await transaction.collection('bill').doc(res.data.billId).update({
                    data: {
                        updateDate: new Date(),
                        money: total,
                    }
                })
                if (!billAdd) {
                    await transaction.rollback(-100)
                }
            } else {
                // 入账
                const billAdd = await transaction.collection('bill').add({
                    data: {
                        _openid: wxContext.OPENID,
                        createDate: new Date(),
                        remarks: '店铺支出',
                        money: -total,
                        shopId,
                        type: 3,
                    }
                })
                if (!billAdd || !billAdd._id) {
                    await transaction.rollback(-100)
                }
                entity.createDate = Date.now()
                entity._openid = wxContext.OPENID
                entity.billId = billAdd._id
                res = await transaction.collection('spend').add({
                    data: entity,
                });
                if (!res || !res._id) {
                    await transaction.rollback(-100)
                }
                const resUpdate = await transaction.collection('bill').doc(billAdd._id).update({
                    data: {
                        spendId: res._id
                    }
                })
                if (!resUpdate) {
                    await transaction.rollback(-100)
                }

            }
        })
        try {
            await cloud.openapi.subscribeMessage.send({
                "touser": 'o82cZ7eYC0_1C30_Xeayrg69CpKk',
                "page": 'pages/shop-manage/spend-management/index?shopId=' + shopId,
                "lang": 'zh_CN',
                "data": {
                    "thing3": {
                        "value": shopName
                    },
                    "thing2": {
                        "value": nameArr.join()
                    },
                    "amount6": {
                        "value": '￥' + total
                    },
                },
                "templateId": 'eL2vo4Mkxby-pjj16NlqI1uMhVVWN-e7hb_UdHOuNuU',
                "miniprogramState": 'trial'
            })

        } catch (error) {

        }
        try {
            await cloud.openapi.subscribeMessage.send({
                "touser": 'o82cZ7dn9oq72jUZU9NZzyqVUqo8',
                "page": 'pages/shop-manage/spend-management/index?shopId=' + shopId,
                "lang": 'zh_CN',
                "data": {
                    "thing3": {
                        "value": shopName
                    },
                    "thing2": {
                        "value": nameArr.join()
                    },
                    "amount6": {
                        "value": '￥' + total
                    },
                },
                "templateId": 'eL2vo4Mkxby-pjj16NlqI1uMhVVWN-e7hb_UdHOuNuU',
                "miniprogramState": 'trial'
            })
        } catch (error) {

        }
        return {
            success: true,
            result
        };
    } catch (e) {
        return {
            success: false,
            errMsg: e
        };
    }
};
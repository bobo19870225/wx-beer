const cloud = require('wx-server-sdk');
cloud.init({
    env: 'beer-1g75udik38f745cf'
});
const db = cloud.database({
    throwOnNotFound: false,
});
exports.main = async (event, context) => {
    const _ = db.command
    const _openid = event._openid
    const name = event.name
    const shopId = event.shopId
    // const vipPackageId = event.vipPackageId
    const entry = event.entry
    const price = event.price
    const beer = event.beer
    if (!_openid || !shopId || !entry || !beer || !price) {
        return {
            success: false,
            errMsg: '参数不完整'
        };
    }
    const vip = await db.collection('vip').where({
        _openid,
        shopId
    }).get();
    const vipData = vip.data
    let res = null
    if (vipData && vipData.length > 0) {
        res = await db.collection('vip').where({
            _openid,
            shopId
        }).update({
            data: {
                // vipPackageId,
                account: {
                    recharge: _.inc(price),
                    balance: _.inc(entry),
                    beer: _.inc(beer),
                },
                updateDate: new Date(),
                isDelete: false
            }
        })
    } else {
        res = await db.collection('vip').add({
            data: {
                _openid,
                name,
                shopId,
                roleId: 'e8da080866481e7401183a545ac1b592',
                account: {
                    recharge: price,
                    balance: entry,
                    beer: beer,
                },
                createDate: new Date(),
                isDelete: false
            }
        })
    }
    return {
        success: true,
        result: res
    };






    // try {
    //     const result = await db.runTransaction(async transaction => {
    //         const _openid = event._openid
    //         const name = event.userName
    //         const shopId = event.shopId
    //         const money = event.money

    //         const user = await transaction.collection('user').where({
    //             _openid,
    //             shopId
    //         }).get()
    //         if (user) {

    //         } else {
    //             const userAdd = transaction.collection('user').add({
    //                 _openid,
    //                 name,
    //                 shopId,
    //                 roleId: 'e8da080866481e7401183a545ac1b592', //会员
    //             })
    //             if (userAdd) {
    //                 const accountAdd = await transaction.collection('account').add({
    //                     userId: userAdd,
    //                     balance: _.inc(money),
    //                 })
    //                 if (!accountAdd) {
    //                     await transaction.rollback(-100)
    //                 }
    //             } else {
    //                 await transaction.rollback(-100)
    //             }
    //         }
    //     })
    //     return {
    //         success: true,
    //         msg: result.aaaAccount,
    //     }
    // } catch (e) {
    //     console.error(`transaction error`, e)
    //     return {
    //         success: false,
    //         msg: e
    //     }
    // }
};
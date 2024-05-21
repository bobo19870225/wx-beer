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
    const balance = event.balance
    const points = event.points

    const user = await db.collection('user').where({
        _openid,
        shopId
    }).get();

    if (user && user.length > 0) {
        // return user
        return await db.collection('user').where({
            _openid,
            shopId
        }).update({
            data: {
                _openid,
                name,
                shopId,
                roleId: 'e8da080866481e7401183a545ac1b592',
                account: {
                    balance: _.inc(balance),
                    points: _.inc(points),
                }
            }
        })
    } else {
        return await db.collection('user').add({
            data: {
                _openid,
                name,
                shopId,
                roleId: 'e8da080866481e7401183a545ac1b592',
                account: {
                    balance: balance,
                    points: points,
                }
            }
        })
    }







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
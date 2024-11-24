const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});



// 聚合记录云函数入口函数
exports.main = async (event, context) => {
    try {
        const result = await cloud.openapi.subscribeMessage.send({
            "touser": 'o82cZ7eYC0_1C30_Xeayrg69CpKk',
            "page": 'index',
            "lang": 'zh_CN',
            "data": {
                "thing3": {
                    "value": '一箱'
                },
                "thing2": {
                    "value": '啤酒'
                },
                "amount6": {
                    "value": '￥100'
                },
            },
            "templateId": 'eL2vo4Mkxby-pjj16NlqI1uMhVVWN-e7hb_UdHOuNuU',
            "miniprogramState": 'trial'
        })
        return result
    } catch (err) {
        return err
    }
};
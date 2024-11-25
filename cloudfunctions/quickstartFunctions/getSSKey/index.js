const cloud = require('wx-server-sdk');
const axios = require('axios');
var WXBizDataCrypt = require('./WXBizDataCrypt')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取openId云函数入口函数
exports.main = async (event, context) => {
    const code = event.code
    var responsedata
    var data
    try {
        await axios.get('https://api.weixin.qq.com/sns/jscode2session?appid=wxd6b8d802f73e0103&secret=233493e5f33c387008ea42fd7ea51f63&js_code=' + code + '&grant_type=authorization_code')
            .then(function (response) {
                responsedata = response.data
                var appId = 'wxd6b8d802f73e0103'
                var sessionKey = responsedata.session_key
                const encryptedData = event.encryptedData
                const iv = event.iv
                var pc = new WXBizDataCrypt(appId, sessionKey)
                data = pc.decryptData(encryptedData, iv)
            })
        return {
            responsedata: data
        }
    } catch (error) {
        return {
            error
        }
    }
};
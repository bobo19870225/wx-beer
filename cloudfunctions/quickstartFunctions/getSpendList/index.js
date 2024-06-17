const cloud = require('wx-server-sdk');
cloud.init({
    env: 'beer-1g75udik38f745cf'
});
const db = cloud.database();
exports.main = async (event, context) => {
    try {
        let {
            shopId,
        } = event.entity
        if (!shopId) {
            return {
                success: false,
                errMsg: 'shopId is null'
            }
        }
        res = await db.collection('spend').where({
            shopId,
            isDelete: false
        }).orderBy('createDate', 'desc').get();
        const data = res.data
        return {
            success: true,
            data
        }
    } catch (error) {
        return {
            success: false,
            errMsg: error
        }
    }

};
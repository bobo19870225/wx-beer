const cloud = require('wx-server-sdk');

cloud.init({
    env: 'beer-1g75udik38f745cf'
});
const db = cloud.database();
exports.main = async (event, context) => {
    try {
        let data = event.data
        const id = data._id
        let res = null
        if (id) {
            delete data._id
            res = await db.collection('user').doc(id).update({
                data
            });
        } else {
            res = await db.collection('user').add({
                data
            });
        }
        return {
            success: true,
            rusult: res
        };
    } catch (e) {
        return {
            success: false,
            errMsg: e
        };
    }
};
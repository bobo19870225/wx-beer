const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
    try {
        let {
            state
        } = event.entity
        // ================== 分页参数 ==============================
        const page = event.page
        let pageNumber = 1
        let pageSize = 100

        if (page && page.pageNumber && page.pageNumber > 1) {
            pageNumber = page.pageNumber
        }
        if (page && page.pageSize && page.pageSize > 0 && page.pageSize < 100) {
            pageSize = page.pageSize //非法值设为最大值
        }
        // ================== 分页参数END ===========================
        const wxContext = cloud.getWXContext()
        const openid = wxContext.OPENID
        let where = {
            shareID: openid
        }
        if (state) {
            where.state = state
        }
        res = await db.collection('share')
            .where(where)
            .orderBy('createDate', 'desc')
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .get();
        res.success = true
        return res
    } catch (error) {
        return {
            success: false,
            errMsg: error
        }
    }

};
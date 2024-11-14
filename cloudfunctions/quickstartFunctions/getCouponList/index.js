const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
    try {
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

        let where = {
            isDelete: false
        }

        res = await db.collection('coupon')
            .where(where)
            .orderBy('startDate', 'asc')
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .get();
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
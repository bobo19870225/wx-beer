const getOpenId = require('./getOpenId/index');
const getMiniProgramCode = require('./getMiniProgramCode/index');
const getUser = require('./getUser/index');
const updateUser = require('./updateUser/index');
const getOrderList = require('./getOrderList/index');
const getOngoingOrdersList = require('./getOngoingOrdersList/index');

const deleteShop = require('./deleteShop/index');
const updateGoods = require('./updateGoods/index');
const deleteGoods = require('./deleteGoods/index');
const updateShop = require('./updateShop/index');
const updateOrder = require('./updateOrder/index');
const updateTableSeats = require('./updateTableSeats/index');
const updateTask = require('./updateTask/index');
const fetchGoodsList = require('./fetchGoodsList/index');
const getShopList = require('./getShopList/index');
const getShopListByKey = require('./getShopListByKey/index');
const getApplication = require('./getApplication/index');
const genMpQrcode = require('./genMpQrcode/index');
const getVip = require('./getVip/index');
const getVipPackage = require('./getVipPackage/index');
const updateVipPackage = require('./updateVipPackage/index');
const payForVip = require('./payForVip/index');
const payForGoods = require('./payForGoods/index');
const getBillList = require('./getBillList/index');
const getBillStatistics = require('./getBillStatistics/index');
const updateSpend = require('./updateSpend/index');
const getSpendList = require('./getSpendList/index');
const getTotalIncom = require('./getTotalIncom/index');
const getCountOrder = require('./getCountOrder/index');
const updateShopManager = require('./updateShopManager/index');
const getIdleTable = require('./getIdleTable/index');
const updateCoupon = require('./updateCoupon/index');
const getActivityId = require('./getActivityId/index');
const getActiveCouponList = require('./getActiveCouponList/index');
const qiangCoupon = require('./qiangCoupon/index');
const getCouponList = require('./getCouponList/index');
const sendMessage = require('./sendMessage/index');




// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        /**
         * 用户唯一识别码
         */
        case 'getOpenId':
            return await getOpenId.main(event, context);
        case 'getMiniProgramCode':
            return await getMiniProgramCode.main(event, context);
        case 'genMpQrcode':
            return await genMpQrcode.main(event, context);
            /**
             * 申请
             */
        case 'getApplication':
            return await getApplication.main(event, context);
        case 'updateTask':
            return await updateTask.main(event, context);
        case 'updateShopManager':
            return await updateShopManager.main(event, context);
            /**
             * 用户
             */
        case 'getUser':
            return await getUser.main(event, context);
        case 'updateUser':
            return await updateUser.main(event, context);
            /**
             * 店铺
             */
        case 'getShopList':
            return await getShopList.main(event, context);
        case 'getShopListByKey':
            return await getShopListByKey.main(event, context);
        case 'updateShop':
            return await updateShop.main(event, context);
        case 'deleteShop':
            return await deleteShop.main(event, context);
            /**
             * 商品
             */
        case 'fetchGoodsList':
            return await fetchGoodsList.main(event, context);
        case 'updateGoods':
            return await updateGoods.main(event, context);
        case 'deleteGoods':
            return await deleteGoods.main(event, context);
            /**
             * 桌位
             */
        case 'updateTableSeats':
            return await updateTableSeats.main(event, context);
        case 'getIdleTable':
            return await getIdleTable.main(event, context);

            /**
             * 订单
             */
        case 'getOrderList':
            return await getOrderList.main(event, context);
        case 'getOngoingOrdersList':
            return await getOngoingOrdersList.main(event, context);
        case 'updateOrder':
            return await updateOrder.main(event, context);
        case 'payForGoods':
            return await payForGoods.main(event, context);
        case 'getCountOrder':
            return await getCountOrder.main(event, context);
            /**
             * 会员
             */
        case 'getVip':
            return await getVip.main(event, context);
        case 'getVipPackage':
            return await getVipPackage.main(event, context);
        case 'updateVipPackage':
            return await updateVipPackage.main(event, context);
        case 'payForVip':
            return await payForVip.main(event, context);
            /**
             * 账单
             */
        case 'getBillList':
            return await getBillList.main(event, context);
        case 'getBillStatistics':
            return await getBillStatistics.main(event, context);
        case 'getTotalIncom':
            return await getTotalIncom.main(event, context);
            /**
             * 支出
             */
        case 'updateSpend':
            return await updateSpend.main(event, context);
        case 'getSpendList':
            return await getSpendList.main(event, context);
            /**
             * 优惠券
             */
        case 'updateCoupon':
            return await updateCoupon.main(event, context);
        case 'getActiveCouponList':
            return await getActiveCouponList.main(event, context);
        case 'qiangCoupon':
            return await qiangCoupon.main(event, context);
        case 'getCouponList':
            return await getCouponList.main(event, context);
            /**
             * 活动分享
             */
        case 'getActivityId':
            return await getActivityId.main(event, context);
            /**
             * 发消息
             */
        case 'sendMessage':
            return await sendMessage.main(event, context);


    }
};
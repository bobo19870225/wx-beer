const getOpenId = require('./getOpenId/index');
const getMiniProgramCode = require('./getMiniProgramCode/index');
const getUser = require('./getUser/index');
const updateUser = require('./updateUser/index');
const getOrderList = require('./getOrderList/index');
const deleteShop = require('./deleteShop/index');
const updateGoods = require('./updateGoods/index');
const deleteGoods = require('./deleteGoods/index');
const updateShop = require('./updateShop/index');
const updateOrder = require('./updateOrder/index');
const updateTableSeats = require('./updateTableSeats/index');
const fetchGoodsList = require('./fetchGoodsList/index');
const getShopList = require('./getShopList/index');
const getApplication = require('./getApplication/index');
const genMpQrcode = require('./genMpQrcode/index');
const getVip = require('./getVip/index');
const updateVipPackage = require('./updateVipPackage/index');
const payForVip = require('./payForVip/index');
const payForGoods = require('./payForGoods/index');

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
            // case 'deleteGoods':
            //     return await deleteGoods.main(event, context);

            /**
             * 订单
             */
        case 'getOrderList':
            return await getOrderList.main(event, context);
        case 'updateOrder':
            return await updateOrder.main(event, context);
            // payForGoods
        case 'payForGoods':
            return await payForGoods.main(event, context);
            /**
             * 会员
             */
        case 'getVip':
            return await getVip.main(event, context);
        case 'updateVipPackage':
            return await updateVipPackage.main(event, context);
        case 'payForVip':
            return await payForVip.main(event, context);



    }
};
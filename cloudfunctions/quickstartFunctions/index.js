const getOpenId = require('./getOpenId/index');
const getMiniProgramCode = require('./getMiniProgramCode/index');
const getOrderList = require('./getOrderList/index');
const deleteShop = require('./deleteShop/index');
const updateGoods = require('./updateGoods/index');
const updateShop = require('./updateShop/index');
const updateOrder = require('./updateOrder/index');
const updateVip = require('./updateVip/index');
const fetchGoodsList = require('./fetchGoodsList/index');
const getShopList = require('./getShopList/index');
const genMpQrcode = require('./genMpQrcode/index');
const payForVip = require('./payForVip/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
    case 'getMiniProgramCode':
      return await getMiniProgramCode.main(event, context);
    case 'getOrderList':
      return await getOrderList.main(event, context);
    case 'deleteShop':
      return await deleteShop.main(event, context);
    case 'updateGoods':
      return await updateGoods.main(event, context);
    case 'updateShop':
      return await updateShop.main(event, context);
    case 'updateOrder':
      return await updateOrder.main(event, context);
    case 'updateVip':
      return await updateVip.main(event, context);
    case 'fetchGoodsList':
      return await fetchGoodsList.main(event, context);
    case 'genMpQrcode':
      return await genMpQrcode.main(event, context);
    case 'getShopList':
      return await getShopList.main(event, context);
    case 'payForVip':
      return await payForVip.main(event, context);
  }
};
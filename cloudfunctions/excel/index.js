const cloud = require('wx-server-sdk')
const xlsx = require('node-xlsx');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async (event, context) => {
    try {
        let {
            fileName,
            rowAndKey,
            sheetName,
            excelData
        } = event
        //1,定义excel表格名
        let dataCVS = fileName || 'test.xlsx'
        //2，定义存储数据的
        let alldata = [];
        const row = rowAndKey.row; //表属性
        const key = rowAndKey.key; //数据属性
        alldata.push(row);
        for (let index = 0; index < excelData.length; index++) {
            const element = excelData[index];
            let arr = [];
            key.forEach(elementKey => {
                arr.push(element[elementKey]);
            });
            alldata.push(arr)
        }
        //3，把数据保存到excel里
        var buffer = await xlsx.build([{
            name: sheetName || "mySheetName",
            data: alldata
        }]);
        //4，把excel文件保存到云存储里
        return await cloud.uploadFile({
            cloudPath: dataCVS,
            fileContent: buffer, //excel二进制文件
        })
    } catch (e) {
        console.error(e)
        return e
    }
}
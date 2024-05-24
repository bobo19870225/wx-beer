// components/upLoadFile/index.js
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    count: {
      type: Number,
      value: 9
    },
    directory: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: '上传图片'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgListId: [],
    isUpLoading: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    ChooseImage() {
      wx.chooseMedia({
        count: this.properties.count, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        mediaType: ['image', 'video'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success: (res) => {
          this.setData({
            isUpLoading: true
          })
          const tempFiles = res.tempFiles
          let size = Math.min(this.properties.count - this.data.imgListId.length, tempFiles.length)
          for (let index = 0; index < size; index++) {
            const tempFilePath = tempFiles[index].tempFilePath;
            let cloudPath = this.properties.directory ? this.properties.directory + '/' + Date.now() + '.png' : Date.now() + '.png'
            // 将图片上传至云存储空间
            wx.cloud.uploadFile({
              // 指定上传到的云路径
              cloudPath: cloudPath,
              // 指定要上传的文件的小程序临时文件路径
              filePath: tempFilePath,
              // 成功回调
              success: res => {
                this.data.imgListId.push(res.fileID)
                this.setData({
                  imgListId: this.data.imgListId
                })
                const myEventOption = {}
                this.triggerEvent('onUploadOk', this.data.imgListId, myEventOption)
              },
              complete: res => {
                if (index == size - 1) {
                  this.setData({
                    isUpLoading: false
                  })
                }
              }
            })
          }
        }
      });
    },
    ViewImage(e) {
      wx.previewImage({
        urls: this.data.imgListId,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {
      wx.showModal({
        title: '温馨提示',
        content: '确定要删除吗？',
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            this.setData({
              isUpLoading: true
            })
            const index = e.currentTarget.dataset.index
            wx.cloud.deleteFile({
              fileList: [this.data.imgListId[index]], // 对象存储文件ID列表，最多50个，从上传文件接口或者控制台获取
              success: res => {
                this.data.imgListId.splice(e.currentTarget.dataset.index, 1);
                this.setData({
                  imgListId: this.data.imgListId
                })
              },
              fail: err => {
                console.error(err)
              },
              complete: res => {
                this.setData({
                  isUpLoading: false
                })
              }
            })
          }
        }
      })
    },
  }
})
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    postData:{},
  },
  properties: {
    showDialogProps: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: '温馨提示',
    },
    content: {
      type: String,
      value: '确定要删除吗？',
    },
    postDataProps: {
      type: Object,
      value: null,
    },
  },
  observers: {
    showDialogProps: function (showDialogProps) {
      this.setData({
        showDialog: showDialogProps
      });
    },
    postDataProps: function (postDataProps) {
      this.setData({
        postData: postDataProps
      });
    },
  },
  methods: {
    onChangeShowUploadTip() {
      this.setData({
        showUploadTip: !this.data.showUploadTip
      });
    },
    hideModal(e) {
      if (e.target.dataset.type == 'ok') {
        const myEventOption = {}
        this.triggerEvent('onOk', this.data.postData, myEventOption)
      }
      this.setData({
        showDialog: false
      });
    },
  }
});
<template>
  <view
    :class="type"
    :style="{ color: color,'font-size': size + 'px',border:border }"
    @click="_onClick"
  />
</template>

<script>
export default {
  name: 'uniIcon',
  props: {
    type: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#333333'
    },
    size: {
      type: [Number, String],
      default: 16
    }, 
	border: {
      type: String,
      default: ''
    }
  },
  methods: {
    _onClick () {
      this.$emit('click')
    }
  }
}
</script>
<style>
/**
 * www.iconfont.cn
 * 导入代码图片
 * 如果想用其他的形状，可换font-face
 */
/**
 * 已选择的形状
 */
@font-face {
  font-family: "iconfont";
  src: url('iconfont.eot?t=1563330804916'); /* IE9 */
  src: url('iconfont.eot?t=1563330804916#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAKYAAsAAAAABkAAAAJMAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcApMaAE2AiQDCAsGAAQgBYRtBy0biwXIHpIkgeppRjAb1QODJERQvx/be+8wkcQQRbNoIpOYTqgkiA1KJRQv4R+/n7sNk5AvojNLmKVZnN/74vffrCEeCiGTKO0naJYgNJrDBhxggBAFZIvs81xO764CCmR+oFzGGLTGoF5AvTiQAtsTo8iKJPKGsQtcwmMCnWatCJ3tHJVhUrJWBeJJU5owmfNJyZLtQmvNwRRvWrSXl/KI1/D78W8nJilaKqvs8nG7A2tfCTutHjfHHnyCn4COt6BiG0jitjZ2bkQw5ojO2KhFsK/i4CvRNL5V7NUk2F9nFXaDaSi+J4krvdVkgdsaawiYHzWFGPL1tryw5F32fFxZJGX5rWqW7w73gqO968FRIIjL9g6DvaNBbdFWXIeKIPc7sAbQfNWPMoHgbGL+v87e27sSfJbvv6Cn+Ur9HLTvxx78D0nPntRllqWkKqkdLIbO09SpEw1g16CPsfqRk6dCu5ERjjYzKap2y2QyttGiyy5atTtEpy27x7sMYSMiO7DpAiD0e0DR6x1VvycyGe9oMeoTrfpjBJ3uY+jCLquhTZ8yNSV1sDVEre3YwrHJ6ai4SErXbHJWFrKqxL4WxHgkVkzukk08xxa/pySkFCjYsXAHPEem6aDLjk5tGVGldAvRqKh7U6TtWDDtFCNNEulALUNI0+awCX+4NF36fBFRdJmauKWrxl9FmE+bHMVFxHqQu2q7V9e9vOLrUSRIkoAE5rCgHTCPmEwO5NbP05E2KUIdEXEVRO1+oq86sr7W+roj0MkylLCrqvqs2QAAAA==') format('woff2'),
  url('iconfont.woff?t=1563330804916') format('woff'),
  url('iconfont.ttf?t=1563330804916') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('iconfont.svg?t=1563330804916#iconfont') format('svg'); /* iOS 4.1- */
}
/**
 * 未选择的形状
 */
@font-face {
  font-family: "iconfont-heart-not-filled";
	src: url('../heart-not-filled/iconfont.eot?t=1564025958906'); /* IE9 */
  src: url('../heart-not-filled/iconfont.eot?t=1564025958906#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAMIAAsAAAAABsQAAAK8AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAqBUIFLATYCJAMICwYABCAFhG0HLxvwBcgekiQlQkRRgGRfgPRgxMP/749vn/vu+7CjIpw4SEKaVKCU5TYdXH0cIofZUiLmRF24C//OEZ18NpeabGprO3ZtGuUUG97B5fRHAQUyDyi3OQaPCRhYGuBe2BZuA4XcMHbBC9xNoMYANzIbCWl5QFlmDwrEZcxWA+WCS5ZZtEqoaJiZxW2lqnQlvQLcir4fv/iEMklZsPP2L8XXgaivRU6cXNv/NicCBHs5A9g8CswBMnG0MbRLTjCSnJqQvBHgWNnB16L7/4FGHFUp2F9nZ9aBPsh6JrbHedTMBHLSugI4Nuk8pAGbpkdBTmHXHwriDl85rfa9e5uNhtYcHy4fKbx57/v+XfFqy13mZV3qX+2YKVi/Nr3z0XPjqePS4+fO+RfvQ9+/zR97c/ynzf6Xl1AMkrqPlm58seMV9UoUZJ++WiDx11a7UzJdTVpn9iN31Br/rImbf6tdLf79vTb+0kcf34KNkTho/qOwyCw4Nr/EseeoXppYLQZEYU/xOt3/09+4y3l/rtQK+1dVm8HnypCJSJENs1B1ZnPwB9kDa7LBtdUpa+xGS7IyKZBQ43j5z7a1+DZV1n67hlBVYDNIKvVDocoYmolzUKo1DxWqLEONWYnza7Ui5ESuxoxuAKHJDiQNXkKhyWs0E79CqcNfqNAUclDjeOitWGsisGosQdUU1cGaFohrxSLG1VLVODsHsQ2CapLnRuQCRDjshd4eXuVoIhIhssQYrpH1oZSBDBELYQLYDwkEYighYh6qpR71lEpCPD2Zpht51IqFQNU6AqlGIXWgGi0grJaYCBM0p1Qrn8+BsBoIVCMdBXXGAgjBwe1D3jx4DUATRaJBBY9yCKcRywdFMSAGISYEJQADInBCYpCkuRsPUovyUD8hIBHCEzVihoo8tpcIfyCTlWDLUzgdCuVZ3IxFAAA=') format('woff2'),
  url('../heart-not-filled/iconfont.woff?t=1564025958906') format('woff'),
  url('../heart-not-filled/iconfont.ttf?t=1564025958906') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('../heart-not-filled/iconfont.svg?t=1564025958906#iconfont') format('svg'); /* iOS 4.1- */
}

uni-icon {
	line-height: 1;
}
.uni-icon {
  font-family: "iconfont-heart-not-filled" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.uni-icon-filled {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.uni-icon.uni-active {
	color: #007aff;
}
.uni-icon-star-filled:before {
	 content: "\e632";
}
.uni-icon-star:before {
	 content: "\e658";
}
</style>

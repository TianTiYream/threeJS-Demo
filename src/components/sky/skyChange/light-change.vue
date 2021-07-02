<template>
  <div>
    <!-- 灯光调节 -->
    <div class="light-change">
      <i class="iconfont">&#xe600;</i>
      <i class="manual">手动</i>
      <i class="iconfont">&#xe6cc;</i>
       <el-slider
        v-model="lightValue"
        vertical
        :marks="marks"
        :show-tooltip="false"
        height="400px"
        @change="changeClock">
      </el-slider>
      <i class="iconfont">&#xe6cc;</i>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LightChange',
  props: ['scene'],
  data () {
    return {
      lightValue: 75,
      marks: {
        0: '24:00',
        12.5: '',
        25: '18:00',
        37.5: '',
        50: '12:00',
        62.5: '',
        75: '6:00',
        87.5: '',
        100: '0:00'
      }
    }
  },
  computed: {
    dayValue: function () {
      if (this.lightValue < 12.5 || this.lightValue > 87.5) {
        return 2
      } else if ((this.lightValue > 12.5 && this.lightValue < 30) ||
      (this.lightValue > 70 && this.lightValue < 87.5)) {
        return 0
      } else {
        return 1
      }
    }
  },
  mounted () {
    // 获取当前时间
    this.autoChangeColck()
  },
  watch: {
    // 时间改变时动态改变背景
    lightValue: function(val, oldVal) {
      if (oldVal !== val) {
        this.$emit('changeSky', val)
      }
    }
  },
  methods: {
    /* 拖动时间滑块时改变环境颜色 */
    changeClock(val) {
      const time = ((100 - val) / 100) * 24
      console.log(time, 'time')
    },
    /* 自动改变时间 */
    autoChangeColck() {
      const time = new Date().getHours()
      this.lightValue = 100 - (time / 24 * 100)
    }
  }
}
</script>

<style scoped>
.light-change {
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
}
.light-change >>> .el-slider__marks .el-slider__marks-text {
  position: absolute;
  left: 25px;
  color: #fff;
}
.light-change >>> .el-slider__button {
  width: 26px;
  height: 40px;
  background: #D19C6D;
  border-radius: 20%;
  margin-left: -2px;
  border: none;
}
.light-change >>> .el-slider__button:before {
  content: '\e730';
  display: block;
  width: 26px;
  color: #fff;
  font-family: "iconfont" !important;
  position: absolute;
  top: 0;
  text-align: center;
}
.light-change >>> .el-slider__button:after {
  content: '\e731';
  width: 26px;
  display: block;
  color: #fff;
  font-family: "iconfont" !important;
  margin-top: 22px;
  text-align: center;
}
.light-change >>> .el-slider__button.dragging,
.light-change >>> .el-slider__button.hover,
.light-change >>> .el-slider__button:hover {
    transform: scale(1);
}
.light-change >>> .el-slider__bar {
  background-color: rgba(255, 255, 255, 0);
}
.light-change >>> .el-slider__stop {
  width: 16px;
  height: 1px;
  margin-left: -6px;
  border-radius: 0%;
}
.light-change >>> .el-slider__stop:nth-child(5) {
  width: 26px;
  height: 36px;
  background: transparent;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  margin-left: -12px;
}
.manual {
  font-style: normal;
  color: #fff;
}
.light-change >>> .el-slider__stop:nth-child(5):after {
  content: '\e60f';
  display: block;
  width: 36px;
  height: 36px;
  line-height: 36px;
  font-family: "iconfont" !important;
  font-size: 34px;
  color: #fff;
  text-align: center;
  margin-left: -5px;
}
.light-change >>> .el-slider__stop:nth-child(1),
.light-change >>> .el-slider__stop:nth-child(9){
  width: 26px;
  margin-left: -10px;
}
.light-change >>> .el-slider.is-vertical .el-slider__bar,
.light-change >>> .el-slider.is-vertical .el-slider__runway {
  width: 2px;
  border-radius: 0%;
}

@font-face {
  font-family: 'iconfont';  /* Project id 2581777 */
  src: url('//at.alicdn.com/t/font_2581777_szddgws3xtc.woff2?t=1622447478906') format('woff2'),
       url('//at.alicdn.com/t/font_2581777_szddgws3xtc.woff?t=1622447478906') format('woff'),
       url('//at.alicdn.com/t/font_2581777_szddgws3xtc.ttf?t=1622447478906') format('truetype');
}
.iconfont{
    font-family:"iconfont" !important;
    font-size: 24px;
    font-style:normal;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
    display: block;
    margin: 21px 0;
}
</style>

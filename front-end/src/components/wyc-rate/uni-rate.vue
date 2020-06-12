<template>
	<view class="uni-rate">
		<view v-for="(star, index) in stars" :key="index" :style="{ marginLeft: index == 0 ? 0 : margin + 'px' }" class="uni-rate-icon" @click="_onClick(index)">
			<uniIcon :size="size" :border="border" :color="color" :type="isFill ? 'uni-icon uni-icon-star' : 'uni-icon-filled uni-icon-star-filled'" />
			<view :style="{ width: star.activeWitch }" class="uni-rate-icon-on"><uniIcon :size="size" :color="activeColor" type="uni-icon-filled uni-icon-star-filled" /></view>
		</view>
	</view>
</template>

<script>
import uniIcon from '@/components/wyc-rate/font-rate/uni-icon.vue';
export default {
	name: 'UniRate',
	components: {
		uniIcon
	},
	props: {
		isFill: {
			// 星星的类型，是否镂空
			type: Boolean,
			default: true
		},
		// 星星的颜色
		color: {
			type: String,
			default: '#CB003C'
		},
		// 星星选中状态颜色
		activeColor: {
			type: String,
			default: '#CB003C'
		},
		// 星星的大小
		size: {
			type: [Number, String],
			default: 24
		},
		// 当前评分
		value: {
			type: [Number, String],
			default: 0
		},
		// 最大评分
		max: {
			type: [Number, String],
			default: 5
		},
		// 星星的间距
		margin: {
			type: [Number, String],
			default: 0
		},
		// 是否可点击
		disabled: {
			type: Boolean,
			default: false
		},
		//是否有边框
		border:{
			type:String,
			default:''
		}
	},
	data() {
		return {
			valueSync: ''
		};
	},
	computed: {
		stars() {
			// const value = Number(this.valueSync) ? Number(this.valueSync) : 0
			const value = Number(this.value) ? Number(this.value) : 0;
			const starList = [];
			const floorValue = Math.floor(value);
			const ceilValue = Math.ceil(value);
			for (let i = 0; i < this.max; i++) {
				if (floorValue > i) {
					starList.push({
						activeWitch: '100%'
					});
				} else if (ceilValue - 1 === i) {
					starList.push({
						activeWitch: (value - floorValue) * 100 + '%'
					});
				} else {
					starList.push({
						activeWitch: '0'
					});
				}
			}
			return starList;
		}
	},
	created() {
		this.valueSync = this.value;
	},
	methods: {
		_onClick(index) {
			if (this.disabled) {
				return;
			}
			this.valueSync = index + 1;
			this.$emit('change', {
				value: this.valueSync
			});
		}
	}
};
</script>

<style lang="scss">
.uni-rate {
	line-height: 0;
	font-size: 0;
	display: flex;
	flex-direction: row;

	&-icon {
		position: relative;
		line-height: 0;
		font-size: 0;
		display: inline-block;

		&-on {
			line-height: 1;
			position: absolute;
			top: 0;
			left: 0;
			overflow: hidden;
		}
	}
}
</style>

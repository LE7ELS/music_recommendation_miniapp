<template>
	<view>
		<view class="person-head">
			<cmd-avatar src="https://avatar.bbs.miui.com/images/noavatar_small.gif" @click="fnInfoWin" size="lg" :make="{'background-color': '#fff'}"></cmd-avatar>
			<view v-if="isLogin" class="person-head-box">
				<view class="person-head-nickname">{{ userInfo.username }}</view>
				<view class="person-head-username">ID：{{ userInfo.userid }}</view>
			</view>
			<view v-else class="person-head-box">
				<view class="person-head-nickname">你好，请登录以获取您的个人数据。</view>
				<button class="person-head-username btn-login" type="warn" size="mini" @click="login">登录</button>
			</view>
		</view>
		<view class="person-list">
			<cmd-cell-item @tap="gotoItem(1)" title="听歌记录" slot-left arrow>
				<cmd-icon type="bullet-list" size="24" color="#C62F2F"></cmd-icon>
			</cmd-cell-item>
			<cmd-cell-item @click="gotoItem(2)" title="我的评分" slot-left arrow>
				<cmd-icon type="star" size="24" color="#C62F2F"></cmd-icon>
			</cmd-cell-item>
			<!-- <cmd-cell-item @click="gotoItem(3)" title="音乐口味" slot-left arrow>
				<cmd-icon type="streaming" size="24" color="#C62F2F"></cmd-icon>
			</cmd-cell-item> -->
			<cmd-cell-item @tap="gotoItem(0)" title="关于" addon="v1.0" slot-left arrow>
				<cmd-icon type="alert-circle" size="24" color="#C62F2F"></cmd-icon>
			</cmd-cell-item>
			<button v-show="isLogin" class="btn-logout" @click="logout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import cmdAvatar from "@/components/cmd-avatar/cmd-avatar.vue"
	import cmdIcon from "@/components/cmd-icon/cmd-icon.vue"
	import cmdCellItem from "@/components/cmd-cell-item/cmd-cell-item.vue"

	import baseUrl from "../../config/index.js"

	export default {
		components: {
			cmdAvatar,
			cmdCellItem,
			cmdIcon
		},
		props: {
			isLogin: Boolean,
			userInfo: Object
		},
		data() {
			return {};
		},
		methods: {
			/**
			 * 登录
			 */
			login() {
				uni.navigateTo({
					url: "../Login/index"
				})
			},
			/**
			 * 退出登录
			 */
			logout() {
				var that = this
				uni.request({
					url: baseUrl.serverUrl + '/page/logout.php?action=logout',
					method: 'POST',
					header: {
						// 有关content-type的说明详见uni-app相关文档
						'content-type': 'application/x-www-form-urlencoded',
					},
					success: (res) => {
						console.log('注销返回结果：', res.data)
						if (res.data.code == '200') {
							uni.showToast({
								title: res.data.msg,
								duration: 2000
							})
							getApp().globalData.LOGIN_STATUS = false
							// 重载当前页面
							getCurrentPages()[0].onShow()
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
								duration: 2000
							})
						}
					}
				})
			},

			/**
			 * 跳转到对应子页面
			 * @param {Object} item
			 */
			gotoItem(item) {
				console.log("跳转到：", item)
				if (this.isLogin == false && item !== 0) {
					item = '未登录'
				}
				switch (item) {
					case 1:
						uni.navigateTo({
							url: '/pages/History/index'
						})
						break;

					case 2:
						uni.navigateTo({
							url: '/pages/MyRating/index'
						})
						break;

					case 3:
						uni.navigateTo({
							url: '/pages/ForMe/index'
						})
						break;

					case 0:
						uni.navigateTo({
							url: '/pages/About/index'
						})
						break;

					default:
						console.log("item值为：", item)
						uni.showToast({
							title: "请先登录！",
							icon: "none"
						})
						break;
				}
			}
		}
	}
</script>

<style>
	.person-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 150px;
		padding-left: 20px;
		background: url(//s3.music.126.net/mobile-new/img/hot_music_bg_2x.jpg?f01a252…=) no-repeat;
		background-size: cover;
	}

	.person-head-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		margin-left: 10px;
	}

	.person-head-nickname {
		font-size: 16px;
		font-weight: bold;
		color: #fff;
	}

	.person-head-username {
		width: 89%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 14px;
		font-weight: 500;
		color: #fff;
	}

	.person-list {
		line-height: 0;
	}

	.btn-login {
		width: 30%;
		margin-top: 10rpx;
		border-radius: 50upx;
		font-size: 16px;
	}

	.btn-logout {
		margin-top: 100upx;
		width: 80%;
		border-radius: 50upx;
		font-size: 16px;
		color: #fff;
		background: linear-gradient(to right, #C62F2F, #ee0a24);
	}
</style>

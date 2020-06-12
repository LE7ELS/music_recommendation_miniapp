<template>
	<view>
		<cmd-page-body type="top">
			<view class="login">
				<view class="login-title">使用账号密码登录</view>
				<cmd-transition name="fade-up">
					<view class="login-username">
						<cmd-input v-model="account.username" type="text" focus maxlength="26" placeholder="请输入账号"></cmd-input>
					</view>
					<view class="login-password">
						<cmd-input v-model="account.password" type="password" displayable maxlength="26" placeholder="请输入密码"></cmd-input>
					</view>
					<button class="btn-login" :class="loginAccount ? 'btn-login-active':''" :disabled="!loginAccount" hover-class="btn-login-hover"
					 @tap="doLogin">登录</button>
				</cmd-transition>
				<view class="link-text" @tap="gotoRegister">没有账号，点我注册</view>
			</view>
		</cmd-page-body>
	</view>
</template>

<script>
	import cmdNavBar from "../../components/cmd-nav-bar/cmd-nav-bar.vue"
	import cmdPageBody from "../../components/cmd-page-body/cmd-page-body.vue"
	import cmdTransition from "../../components/cmd-transition/cmd-transition.vue"
	import cmdInput from "../../components/cmd-input/cmd-input.vue"

	import baseUrl from "../../config/index.js"

	export default {
		components: {
			cmdNavBar,
			cmdPageBody,
			cmdTransition,
			cmdInput
		},

		data() {
			return {
				// 账号登录部分数据
				account: {
					username: '',
					password: ''
				},
				usernameReg: /^[A-Za-z0-9]+$/,
				passwordReg: /^\w+$/,
				loginAccount: false,
			};
		},

		watch: {
			/**
			 * 监听账号登录数值
			 */
			account: {
				handler(newValue) {
					if ((this.usernameReg.test(newValue.username) && newValue.username.length >= 3) && (this.passwordReg.test(
							newValue.password) && newValue.password.length >= 3)) {
						this.loginAccount = true;
					} else {
						this.loginAccount = false
					}
				},
				deep: true
			}
		},

		methods: {
			/**
			 * 登录按钮点击执行
			 */
			doLogin() {
				// 加载动画
				uni.showLoading({
					title: "登录中..."
				});

				// 登录功能单独使用uni.request请求获取header，不走Promise Api
				uni.request({
					url: baseUrl.serverUrl + '/page/login.php',
					method: 'POST',
					data: {
						username: this.account.username,
						password: this.account.password
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //有关content-type的说明详见uni-app相关文档
					},
					success: (res) => {
						// 关闭加载动画
						uni.hideLoading()
						console.log('登录结果：', res.data)
						if (res.data.code == '200') {
							// 登录成功执行的操作
							this.loginAccount = false; // 禁用登录按钮

							/**
							 * 解决小程序无法触发服务端SESSION的问题
							 * 参考：https://fengkui.net/article/41
							 * ————————————————————————————————————————————————————
							 * 登录成功，获取第一次的sessionid,存储起来
							 * 注意：Set-Cookie（开发者工具中调试全部小写）（远程调试和线上首字母大写）
							 */
							uni.setStorageSync("sessionid", res.header["Set-Cookie"])

							// 登录成功后获取用户信息
							this.getUserInfo()
						} else {
							// 登录失败执行的操作
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
								mask: true,
								duration: 2000
							})
						}
					},
					complete: () => {
						// 关闭加载动画
						uni.hideLoading()
					}
				});
			},

			/**
			 * 登录成功后获取用户信息
			 */
			getUserInfo() {
				uni.request({
					url: baseUrl.serverUrl + '/page/_get_userinfor.php',
					method: 'POST',
					header: {
						// 有关content-type的说明详见uni-app相关文档
						'content-type': 'application/x-www-form-urlencoded',
						// 读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
						'cookie': uni.getStorageSync("sessionid")
					},
					success: (res) => {
						console.log('登录返回结果：', res.data)
						if (res.data.code == '200') {
							uni.showToast({
								icon: "none",
								title: res.data.username + "，欢迎您！",
								duration: 2000
							})

							// 更改全局状态
							getApp().globalData.LOGIN_STATUS = true
							getApp().globalData.USER_INFO.USER_ID = res.data.userid
							getApp().globalData.USER_INFO.USER_NAME = res.data.username

							// 跳转回用户中心
							setTimeout(function() {
								uni.navigateBack({
									animationType: 'pop-out'
								})
							}, 2000) //延迟时间
						} else {
							console.log('获取用户信息失败：', res.data)
						}
					},
					fail: (e) => {
						console.log('请求接口出错：', e)
					}
				})
			},

			/**
			 * 跳转注册页面
			 */
			gotoRegister() {
				uni.navigateTo({
					url: "../Register/index"
				})
			}
		}
	}
</script>

<style>
	.login {
		margin-top: 16upx;
		margin-right: 72upx;
		margin-left: 72upx;
	}

	.login-title {
		font-size: 56upx;
		font-weight: 500;
	}

	.login-explain {
		font-size: 28upx;
		color: #ee0a24;
	}

	.login-username {
		margin-top: 56upx;
		margin-bottom: 40upx;
		border-bottom: 2upx #dedede solid;
	}

	.login-password {
		border-bottom: 2upx #dedede solid;
	}

	.btn-login {
		margin-top: 100upx;
		border-radius: 50upx;
		font-size: 16px;
		color: #fff;
		background: linear-gradient(to right, #F67175, #FF9494);
	}

	.btn-login-active {
		background: linear-gradient(to right, #C62F2F, #ee0a24);
	}

	.btn-login-hover {
		background: linear-gradient(to right, #C62F2F, #ee0a24);
	}

	button[disabled] {
		color: #fff;
	}

	.link-text {
		text-align: center;
		margin-top: 32upx;
	}
</style>

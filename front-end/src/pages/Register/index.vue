<template>
	<view>
		<cmd-page-body type="top">
			<view class="register">
				<view class="register-title">账号密码注册</view>
				<view v-if="showAlert" class="tips">此账号名已被占用</view>
				<cmd-transition name="fade-up">
					<view>
						<view class="register-username">
							<cmd-input v-model="account.username" type="text" focus maxlength="26" placeholder="请输入账号"></cmd-input>
						</view>
						<view class="register-password">
							<cmd-input v-model="account.password" type="password" displayable maxlength="26" placeholder="请输入密码"></cmd-input>
						</view>
						<button class="btn-register" :class="registerAccount ? 'btn-register-active':''" :disabled="!registerAccount"
						 hover-class="btn-register-hover" @tap="doRegister">注册</button>
					</view>
				</cmd-transition>
				<view class="link-text" @tap="backToLogin">返回登录</view>
			</view>
		</cmd-page-body>
	</view>

</template>

<script>
	import cmdNavBar from "../../components/cmd-nav-bar/cmd-nav-bar.vue"
	import cmdPageBody from "../../components/cmd-page-body/cmd-page-body.vue"
	import cmdTransition from "../../components/cmd-transition/cmd-transition.vue"
	import cmdInput from "../../components/cmd-input/cmd-input.vue"

	import {
		checkUser,
		register
	} from "../../api/index.js"

	export default {
		components: {
			cmdNavBar,
			cmdPageBody,
			cmdTransition,
			cmdInput
		},

		data() {
			return {
				account: {
					username: '',
					password: ''
				},
				showAlert: false,
				usernameReg: /^[A-Za-z0-9]+$/,
				passwordReg: /^\w+$/,
				registerAccount: false,
			};
		},

		watch: {
			/**
			 * 监听账号注册数值
			 */
			account: {
				handler(newValue) {
					// 检查账号是否可用
					checkUser({
						user_name: newValue.username
					}).then(res => {
						if (res.code == '500') {
							// 账号已被注册
							this.showAlert = true;
							this.registerAccount = false;
						} else if (res.code == '200') {
							this.showAlert = false;
						}
					})
					// 检查输入规范
					if ((this.usernameReg.test(newValue.username) && newValue.username.length >= 3) && (this.passwordReg.test(
							newValue
							.password) && newValue.password.length >= 3)) {
						this.registerAccount = true;
					} else {
						this.registerAccount = false;
					}
				},
				deep: true
			}
		},

		methods: {
			/**
			 * 注册按钮点击执行
			 */
			doRegister() {
				// 加载动画
				uni.showLoading({
					title: "注册中..."
				});

				register({
					user: this.account.username,
					passwd: this.account.password
				}).then(res => {
					// 关闭加载动画
					uni.hideLoading();

					console.log("注册返回值：", res)
					if (res.code == '200') {
						uni.showToast({
							title: res.msg,
							mask: true,
							duration: 2000
						})
						this.registerAccount = false;
						setTimeout(function() {
							// 避免调用 this.backToLogin() 方法报错
							uni.navigateBack({
								animationType: 'pop-out'
							})
						}, 2000) //延迟时间
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg,
							mask: true,
							duration: 2000
						})
					}
				})
			},

			/**
			 * 返回登录
			 */
			backToLogin() {
				uni.navigateBack({
					animationType: 'pop-out'
				})
			}
		}
	}
</script>

<style>
	.register {
		margin-top: 16upx;
		margin-right: 72upx;
		margin-left: 72upx;
	}

	.register-title {
		font-size: 56upx;
		font-weight: 500;
	}

	.tips {
		font-size: 28upx;
		color: #ee0a24;
	}

	.register-username {
		margin-top: 56upx;
		margin-bottom: 40upx;
		border-bottom: 2upx #dedede solid;
	}

	.register-password {
		border-bottom: 2upx #dedede solid;
	}

	.btn-register {
		margin-top: 100upx;
		border-radius: 50upx;
		font-size: 16px;
		color: #fff;
		background: linear-gradient(to right, #F67175, #FF9494);
	}

	.btn-register-active {
		background: linear-gradient(to right, #C62F2F, #ee0a24);
	}

	.btn-register-hover {
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

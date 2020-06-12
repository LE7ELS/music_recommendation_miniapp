<template>
	<view class="content">
		<van-tabs :active="current" color="#ee0a24">
			<van-tab title="推荐">
				<Recommend ref="refresh" :isLogin="isLogin" />
			</van-tab>
			<van-tab title="搜索">
				<Search />
			</van-tab>
			<van-tab title="我的">
				<User :isLogin="isLogin" :userInfo="userinfo" />
			</van-tab>
		</van-tabs>
		<SongFooter ref="SongFooter" />
	</view>
</template>

<script>
	import Recommend from "../Recommend/index";
	import Search from "../Search/index";
	import User from "../User/index";
	import SongFooter from "../../components/SongFooter";

	export default {
		components: {
			Recommend,
			Search,
			User,
			SongFooter
		},
		data() {
			return {
				current: 0,
				isLogin: false,
				userinfo: {
					username: '',
					userid: ''
				}
			};
		},
		onShow() {
			console.log('触发了onShow()方法。')
			this.isLogin = getApp().globalData.LOGIN_STATUS
			this.userinfo.username = getApp().globalData.USER_INFO.USER_NAME
			this.userinfo.userid = getApp().globalData.USER_INFO.USER_ID

			// 登录后清空用户推荐列表并重新获取用户推荐
			if (this.isLogin == true) {
				this.$refs.refresh.UserRecomList = []
				this.$refs.refresh.getUserRecom()
			}

			this.$store.state.audio.onCanplay(() => {
				//更新底部播放的状态
				this.$refs.SongFooter.update();
				//因为vuex不能直接在模板内更新
				this.$refs.SongFooter.updateStore();
				// this.$refs.Hot.updateStore();
			});
			//   监听播放和暂停事件
			this.$store.state.audio.onPlay(() => {
				this.$refs.SongFooter.onPlay();
				this.$refs.SongFooter.updateStore();
				// this.$refs.Hot.updateStore();
			});
			this.$store.state.audio.onPause(() => {
				this.$refs.SongFooter.onPause();
				this.$refs.SongFooter.updateStore();
				// this.$refs.Hot.updateStore();
			});
			if (this.$store.state.audio.id) {
				this.$refs.SongFooter.Draw();
				this.$refs.SongFooter.updateStore();
				// this.$refs.Hot.updateStore();
			}
		},
		methods: {}
	};
</script>

<style lang='scss' scoped>
	/deep/ .van-tab--active {
		color: #ee0a24;
	}
</style>

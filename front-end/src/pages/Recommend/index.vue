<template>
	<View class="Recommend">
		<!-- CNN 推荐展示区 -->
		<View class="Hot SongList">
			<View class="coverBox">
				<View class="cover" @click="play">
					<image :src="baseTrackInfo.base_pic ? baseTrackInfo.base_pic : require('../../static/defaultMusicAvatar.jpg')"
					 mode="widthFix"></image>
				</View>
				<View class="time">根据歌曲 {{ baseTrackInfo.base_name }} 为您推荐✨
					<text style="text-decoration: underline;" @click="change">换一首</text>
				</View>
			</View>
			<View class="cell-title">
				基于深度学习的推荐
				<van-icon name="arrow" size="20px" color="#999" />
			</View>
			<View class="loading-box" v-if='isLoading'>
				<van-loading class="loading-text" color="#dd001b" size="24px" />{{ tips }}
				<View class="loading-button" v-show="btShow">
					<button type="warn" plain="true" size="mini" @click="retry">重试</button>
				</View>
			</View>
			<View v-else @click="showToast()" class="item" :key="index" v-for="(item, index) in CNNRecomList">
				<View class="left">{{ index + 1 }}</View>
				<View class="box">
					<View class="middle">
						<View class="ellipsis">{{ item.name }}</View>
						<Text class="ellipsis">{{ item.ar + " - " + item.name}}</Text>
					</View>
					<View class="right">
						<van-tag plain type="danger">{{ item.genre }}</van-tag>
					</View>
				</View>
			</View>
		</View>

		<!-- 基于物品的协同过滤推荐展示区 -->
		<View class="cell-title">
			基于项目的协同过滤推荐
			<van-icon name="arrow" size="20px" color="#999" />
		</View>
		<View class="cell-SongSheet">
			<SongSheet v-for="(item, index) in SimilarList" :key="index" :song_item="item" :name="item.full_song_name" :picUrl="item.album_pic + '?imageView&thumbnail=250x0'"
			 @click="go(item)" />
		</View>

		<!-- 基于用户的协同过滤推荐展示区 -->
		<View class="cell-title">
			基于用户的协同过滤推荐
			<van-icon name="arrow" size="20px" color="#999" />
		</View>
		<View v-if='isLogin' class="cell-SongSheet">
			<SongSheet v-for="(item, index) in UserRecomList" :key="index" :song_item="item" :name="item.full_song_name" :picUrl="item.album_pic + '?imageView&thumbnail=250x0'"
			 @click="go(item)" />
		</View>
		<View v-else class="prompt-box">
			<Text class="prompt-text">你还没有登录，请先登录。</Text>
			<button class="prompt-button" type="warn" size="mini" @click="gotoLogin">点我去登录</button>
		</View>
	</View>
</template>

<script>
	import {
		getSimilar,
		getUserRecom,
		getDetail
	} from "../../api/index";
	import SongSheet from "../../components/SongSheet";
	import VanIcon from "../../wxcomponents/vant-weapp/icon/index";
	import VanTag from "../../wxcomponents/vant-weapp/tag/index";
	import VanLoading from "../../wxcomponents/vant-weapp/loading/index";

	import baseUrl from "../../config/index.js"
	import Bus from '../../utils/Bus.js'

	export default {
		components: {
			SongSheet,
			VanIcon,
			VanTag,
			VanLoading
		},
		props: {
			isLogin: Boolean
		},
		data: {

		},
		data() {
			return {
				baseId: '', //从基础歌曲ID数组中获取的其中一个
				baseTrackInfo: {}, //根据推荐歌曲的基本信息
				CNNRecomList: [], //CNN推荐结果
				SimilarList: [], //基于物品推荐的歌曲
				UserRecomList: [], //基于用户推荐的歌曲
				isLoading: true, //加载状态
				tips: "歌曲分析推荐中......",
				btShow: false,
			};
		},
		created() {
			let idArray = getApp().globalData.BASE_TRACK_ID
			this.baseId = idArray[Math.floor(Math.random() * idArray.length)]
			console.log('从数组中随机返回结果：', this.baseId)

			getDetail({
				id: this.baseId //获取全局变量
			}).then(res => {
				console.log("基本歌曲的详情信息：", res)
				this.baseTrackInfo.base_name = res.song_name
				this.baseTrackInfo.base_pic = res.album_picture
			})

			this.getCNNRecom()

			uni.showLoading({
				title: "Loading"
			});
			Promise.all([
				this.getSimilar(),
				this.getUserRecom()
			]).then(() => {
				uni.hideLoading();
			});
		},
		mounted() {
			// 在mounted函数中监听来自Song组件的更新
			Bus.$on('doRecom', id => {
				console.log("根据播放的歌曲更新推荐结果。", id)
				this.baseId = id

				// 获取歌曲详情
				getDetail({
					id: this.baseId //获取全局变量
				}).then(res => {
					console.log("基本歌曲的详情信息：", res)
					this.baseTrackInfo.base_name = res.song_name
					this.baseTrackInfo.base_pic = res.album_picture
				})

				// 清空原有列表，重新请求推荐
				this.SimilarList = []
				this.CNNRecomList = []
				this.getSimilar()
				this.getCNNRecom()
			})
		},
		methods: {
			//播放默认歌曲
			// play() {
			// 	uni.navigateTo({
			// 		url: `/pages/Song/index?id=` + this.baseId
			// 	});
			// },

			/**
			 * 跳转到歌曲详情页
			 * @method go
			 * @param {Object} item 当前歌曲的详细信息
			 * @return {undefined}
			 */
			// go(item) {
			// 	//如歌没有播放歌曲 或者 播放的不是当前歌曲,则播放当前歌曲
			// 	console.log('搜索结果点击后item为：', item)
			// 	if (
			// 		!this.$store.state.song ||
			// 		this.$store.state.song.id !== item.id
			// 	) {
			// 		this.$store.dispatch("setGlobalData", {
			// 			key: "song",
			// 			value: item
			// 		});
			// 	}
			// 	//更新播放列表
			// 	this.$store.dispatch("setGlobalData", {
			// 		key: "songList",
			// 		value: this.SimilarList
			// 	});

			// 	// 设置为顺序播放
			// 	this.$store.dispatch("setGlobalData", {
			// 		key: "mode",
			// 		value: 2
			// 	});

			// 	uni.navigateTo({
			// 		url: `/pages/Song/index?id=${item.id}`
			// 	});
			// },

			/**
			 * 点击提示
			 */
			showToast() {
				uni.showToast({
					icon: 'none',
					title: "歌曲ID无法映射，无法播放。",
					mask: true,
					duration: 1000
				})
			},

			/**
			 * 重新请求CNN推荐
			 */
			retry() {
				console.log("重新请求CNN推荐......")
				this.tips = "尝试重新分析中......"
				this.btShow = false
				this.getCNNRecom()
			},

			/**
			 * 切换分析的歌曲
			 */
			change() {
				// 从数组中重新取值
				let idArray = getApp().globalData.BASE_TRACK_ID
				this.baseId = idArray[Math.floor(Math.random() * idArray.length)]
				console.log("切换歌曲并重新请求CNN推荐......")
				this.tips = "尝试重新分析中......"
				this.btShow = false

				// 获取歌曲详情
				getDetail({
					id: this.baseId //获取全局变量
				}).then(res => {
					console.log("基本歌曲的详情信息：", res)
					this.baseTrackInfo.base_name = res.song_name
					this.baseTrackInfo.base_pic = res.album_picture
				})
				// 清空原有列表，重新请求推荐
				this.SimilarList = []
				this.getSimilar()
				this.getCNNRecom()
			},

			/**
			 * 未登录时点击跳转到登录页面
			 */
			gotoLogin() {
				uni.navigateTo({
					url: '../Login/index'
				})
			},

			/**
			 * 获取基于CNN的推荐
			 * @method getCNNRecom
			 * @return {Promise}
			 */
			getCNNRecom() {
				uni.request({
					url: baseUrl.serverUrl + '/page/get_similar_content_track.php',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						song_id: this.baseId //获取全局变量
					},
					success: (result) => {
						console.log("CNN推荐结果：", result.data)
						let res = result.data
						this.isLoading = true
						if (res['code'] !== '200' || res['recommendations'] == null) {
							this.tips = "分析失败，您可以尝试："
							this.btShow = true
						} else {
							this.isLoading = false
							let recom_song = res['recommendations']
							for (let i = 0, len = recom_song.length; i < len; i++) {
								let recom_genre = 'unknow'
								switch (recom_song[i][0]["parent_genre"]) {
									case 'Breakbeat':
										recom_genre = "碎拍电子"
										break;

									case 'Dancehall/Ragga':
										recom_genre = "雷鬼"
										break;

									case 'Downtempo':
										recom_genre = "缓拍电子"
										break;

									case 'Drum And Bass':
										recom_genre = "鼓打贝斯"
										break;

									case 'Funky House':
										recom_genre = "放克电子"
										break;

									case 'Hip Hop/R&B':
										recom_genre = "嘻哈说唱"
										break;

									case 'Minimal House':
										recom_genre = "极简电子"
										break;

									case 'Rock/Indie':
										recom_genre = "独立摇滚"
										break;

									case 'Trance':
										recom_genre = "迷幻舞曲"
										break;

									default:
										recom_genre = "其他类型"
										break;
								}
								this.CNNRecomList.push({
									ar: recom_song[i][0]["release_artist"],
									name: recom_song[i][0]["track_name"].split('-')[0],
									genre: recom_genre
								})
							}

						}
					},
					fail: (e) => {
						console.log("请求错误：", e)
						this.tips = "分析超时，您可以尝试："
						this.btShow = true
					}
				})
			},

			/**
			 * 获取基于物品的推荐
			 * @method getSimilar
			 * @return {Promise}
			 */
			getSimilar() {
				getSimilar({
					id: this.baseId //获取全局变量
				}).then(res => {
					// console.log("项目（单曲）推荐结果：", res)
					// 推荐结果
					for (let key in res) {
						if (key == 'code') continue
						let item = res[key]
						this.SimilarList.push({
							song_id: item.song_id,
							full_song_name: (item.artist_name + ' - ' + item.song_name),
							album_pic: item.album_picture,
						});
					}
				});
			},

			/**
			 * 获取基于用户的推荐
			 * @method getBanner
			 * @return {Promise}
			 */
			getUserRecom() {
				getUserRecom({
					user_id: getApp().globalData.USER_INFO.USER_ID // 全局用户id
				}).then(res => {
					// console.log("用户推荐歌曲id结果：", res)
					if (res['code'] == '200') {
						// 推荐结果
						let recommendations = res['recommendations']
						this.UserRecomList = []
						for (let key in recommendations) {
							let recommend_track_id = recommendations[key];
							// 根据id查询歌曲详情
							getDetail({
								id: recommend_track_id
							}).then(data => {
								// 解析数据到响应式数组中
								// console.log('用户推荐歌曲详情：', data)
								if (data.hasOwnProperty('0')) {
									let temp = data[0]
									this.UserRecomList.push({
										song_id: temp.song_id,
										full_song_name: (temp.artist_name + ' - ' + temp.song_name),
										album_pic: temp.album_picture,
									});
								} else {
									this.UserRecomList.push({
										song_id: data.song_id,
										full_song_name: (data.artist_name + ' - ' + data.song_name),
										album_pic: data.album_picture,
									})
								}
							})
						}
					}
				});
			}
		}
	};
</script>

<style lang='scss' scoped>
	// /deep/ .van-tab--active {
	//     color: #dd001b;
	// }
	image {
		width: 100%;
		height: 200px;
	}

	.cell-title {
		font-size: 32rpx;
		margin-top: 20rpx;
		margin-bottom: 10rpx;
		padding: 0 15px;
	}

	.cell-SongSheet {
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 8px;
		margin: 0 16rpx;
	}

	van-icon {
		position: relative;
		top: 5px;
	}

	.coverBox {
		position: relative;
		background: url(//s3.music.126.net/mobile-new/img/hot_music_bg_2x.jpg?f01a252…=) no-repeat;
		background-size: cover;
		height: 146px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding-left: 15px;

		.cover {
			float: left;
			background-size: 100px 100px;
			width: 100px;
			height: 100px;
			border-radius: 10rpx;
		}

		.time {
			color: hsla(0, 0%, 100%, 0.8);
			font-size: 14px;
			transform: scale(0.91);
			transform-origin: left top;
			margin-top: 10px;
		}
	}

	.SongList {
		.header {
			display: flex;
			border-radius: 13px 13px 0 0;
			height: 45px;
			line-height: 45px;
			background-color: #fff;
			align-items: center;
			font-size: 30rpx;
			border-bottom: 1px solid #eee;
			overflow: hidden;

			image {
				width: 20px;
				height: 20px;
				margin-right: 15px;
				margin-left: 15px;
			}

			.left {
				margin-right: auto;
				color: #333;

				Text {
					color: #999;
				}
			}

			.right {
				height: 100%;
				padding: 0 8px;
				background-color: red;
				color: #fff;
				text-align: center;
				min-width: 110px;
			}
		}

		.item {
			display: flex;
			align-items: center;
			padding: 0 15px;
			font-size: 30rpx;
			color: #333;
			height: 50px;

			.left {
				margin-right: 20px;
				color: #888;
			}

			.box {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #eee;
				padding-right: 15px;
				height: 100%;
				overflow: hidden;

				.middle {
					display: flex;
					flex-direction: column;
					flex: 0 0 80%;
					overflow: hidden;

					text {
						font-size: 24rpx;
						color: #888;
						margin-top: 1px;
					}

					.ellipsis {
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				.right {
					height: 25px;
					margin-top: 3px;
				}
			}
		}
	}

	.loading-box {
		display: inline-block;
		margin: 36rpx;
		align-items: center;
	}

	.loading-text {
		margin-right: 20rpx;
		display: inline-block;
	}

	.loading-button {
		float: right;
		padding: 0 14rpx;
	}

	.prompt-box {
		display: flex;
		justify-content: space-between;
		margin: 24rpx;
		align-items: center;
	}

	.prompt-text {
		flex: 3;
		margin: 24rpx 24rpx;
		font-size: 24rpx;
	}

	.prompt-button {
		flex: 1;
		margin: 24rpx 24rpx;
	}
</style>

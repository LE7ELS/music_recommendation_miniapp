<template>
	<View class="Search">
		<View class="searchBox">
			<View class="search_input">
				<van-icon custom-class="search_icon" size="16px" name="search" />
				<Input type="text" v-model="search" confirm-type="search" @confirm="onConfirm" @focus="show_close = true" @blur="show_close = false" />
				<view class="search_close" @click="reset" :style="{ opacity: show_close ? 1 : 0 }">
					<van-icon size="12px" name="cross" />
				</view>
			</View>
			<view class="btn" @click="onConfirm">搜索</view>
		</View>

		<!-- 热歌榜 -->
		<View class="Hot SongList" v-if='showHotlist'>
			<View class="hot">热歌榜({{ $GetDateTime(new Date(this.time), "m月d日") }})</View>
			<View class="item" :key="index" v-for="(item, index) in SongList" @click="go(item)">
				<View class="left">{{ index + 1 }}</View>
				<View class="box">
					<View class="middle">
						<View class="ellipsis">{{ item.name }}</View>
						<Text class="ellipsis">{{ item.ar + " - " + item.al.name }}</Text>
					</View>
				</View>
			</View>
		</View>

		<!-- 搜索结果滚动列表 -->
		<scroll-view v-else class="scrollview" scrollY scrollWithAnimation scrollTop="0" lowerThreshold="20" @scrolltolower="scroll">
			<View class="item" v-for="(item, index) in SongList" :key="index" @click="go(item)">
				<View class="left">{{ index + 1 }}</View>
				<View class="box">
					<View class="middle">
						<View class="ellipsis">{{ item.name }}</View>
						<Text class="ellipsis">{{ item.ar + " - " + item.al.name }}</Text>
					</View>
				</View>
			</View>
		</scroll-view>
	</View>
</template>

<script>
	import {
		getHot,
		search
	} from "../../api/index";
	import VanTag from "../../wxcomponents/vant-weapp/tag/index";
	import VanIcon from "../../wxcomponents/vant-weapp/icon/index";

	export default {
		components: {
			VanTag,
			VanIcon
		},
		data() {
			return {
				search: "",
				rows: 50, //每页数量
				page: 1, //当前页
				total: 0, //总数
				SongList: [],
				time: new Date().getTime(),
				audio_paused: null,
				audio_id: null,
				show_close: false, //是否显示搜索框的叉叉
				showHotlist: true
			};
		},
		created() {
			this.getHotList()
		},
		mounted() {
			console.log('搜索tab加载时输出：', this);
		},
		methods: {
			// 清除搜索输入框
			reset() {
				this.search = "";
				this.SongList = [];
				this.getHotList();
				this.showHotlist = true;
			},

			/**
			 * 获取热门歌曲
			 */
			getHotList() {
				getHot({
					limit: 20 //加载热门歌曲数
				}).then(res => {
					console.log("热榜res：", res)
					this.SongList = []
					if (res['code'] == '200') {
						for (let key in res) {
							if (key == 'code') continue //跳过code字段继续执行
							let item = res[key]
							this.SongList.push({
								al: {
									picUrl: item.album_picture,
									name: item.album_name
								},
								ar: item.artist_name,
								name: item.song_name,
								id: item.song_id
							});
						}
					} else {
						console.log('请求热歌榜出错！code：', res['code'])
					}
				}).catch(e => {
					console.log('请求热榜时抛出错误：', e)
				});
			},

			/**
			 * 搜索
			 * @method onConfirm
			 * @return {undefined}
			 */
			onConfirm(event) {
				if (!this.search) {
					this.SongList = [];
					this.reset();
					return;
				}

				this.SongList = []
				this.showHotlist = false
				uni.showLoading({
					title: "搜索中..."
				});
				search({
					track_name: this.search,
					limit: this.rows
				}).then(res => {
					console.log('搜索返回结果：', res)
					if (res.code == '200') {
						if (res.songCount <= 0) {
							uni.hideLoading();
							uni.showToast({
								title: '没有找到歌曲',
								icon: "none",
								duration: 1000
							});
							return;
						}

						for (let key in res) {
							//跳过code字段继续执行
							if (key == 'code' || key == 'msg' || key == 'songCount') continue
							let item = res[key]
							this.SongList.push({
								al: {
									picUrl: item.album_picture,
									name: item.album_name
								},
								ar: item.artist_name,
								name: item.song_name,
								id: item.song_id
							});
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1000
						});
					}

					this.total = res.songCount;
					this.page = 2;
					uni.hideLoading();
				});
			},

			/**
			 * 跳转到歌曲详情页
			 * @method go
			 * @param {Object} item 当前歌曲的详细信息
			 * @return {undefined}
			 */
			go(item) {
				console.log('搜索结果点击后item为：', item)
				//如果没有播放歌曲 或者 播放的不是当前歌曲,则播放当前歌曲
				if (
					!this.$store.state.song ||
					this.$store.state.song.id !== item.id
				) {
					this.$store.dispatch("setGlobalData", {
						key: "song",
						value: item
					});
				}
				//更新播放列表
				this.$store.dispatch("setGlobalData", {
					key: "songList",
					value: this.SongList
				});

				// 设置为顺序播放
				this.$store.dispatch("setGlobalData", {
					key: "mode",
					value: 2
				});

				uni.navigateTo({
					url: `/pages/Song/index?id=${item.id}`
				});
			},

			scroll(e) {
				if (Math.ceil(this.total / this.rows) < this.page) {
					uni.showToast({
						title: "没有更多了",
						icon: "none",
						duration: 1000
					});
					return;
				}
				uni.showLoading({
					title: "正在获取更多..."
				});
				search({
					track_name: this.search,
					limit: this.rows,
					offset: this.page
				}).then(res => {
					console.log('上拉加载结果：', res)
					if (res.songCount <= (res.songCount - 50)) {
						uni.hideLoading();
						uni.showToast({
							title: "没有找到歌曲",
							icon: "none",
							duration: 1000
						});
						return;
					}
					let arr = [...this.SongList];
					for (let key in res) {
						//跳过code字段继续执行
						if (key == 'code' || key == 'msg' || key == 'songCount') continue
						let item = res[key]
						arr.push({
							al: {
								picUrl: item.album_picture,
								name: item.album_name
							},
							ar: item.artist_name,
							name: item.song_name,
							id: item.song_id
						});
					}
					this.total = res.songCount;
					this.page++;
					this.SongList = arr;
					uni.hideLoading();
				});
			}
		}
	};
</script>

<style lang='scss' scoped>
	.Search .btn {
		background-color: #C62F2F;
		color: #fff;
		border-radius: 6px;
		padding: 0 10px;
		height: 30px;
		line-height: 30px;
	}

	.Search {
		.item {
			display: flex;
			align-items: center;
			padding-left: 20px;
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
					flex: 0 0 100%;
					overflow: hidden;

					Text {
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
					image {
						width: 25px;
						height: 25px;
						margin-top: 3px;
					}
				}
			}
		}

		.scrollview {
			height: calc(100vh - 90px);
		}

		.hot {
			padding: 10px 15px;
			font-size: 32rpx;
		}

		.tagBox {
			padding: 0 10px;
		}

		/deep/ .tag {
			margin: 5px;
			display: inline-block;
			font-size: 13px;
			color: #666;
			padding: 0 32rpx;
			font-size: 28rpx;
			height: 60rpx;
			line-height: 58rpx;
		}

		/deep/ .search_icon {
			position: absolute;
			left: 7px;
			top: 50%;
			transform: translateY(-50%);
		}

		.search_close {
			z-index: 10;
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 30px;
			height: 30px;
			right: 0px;
			top: 50%;
			transform: translateY(-50%);
		}

		.searchBox {
			position: relative;
			display: flex;
			align-items: center;
			height: 45px;
			padding: 8px 15px;
			box-sizing: border-box;
			border-bottom: 1px solid #f5f5f5;

			.search_input {
				position: relative;
				flex: 1;
				background-color: #f5f5f5;
				border-radius: 50px;
				height: 100%;
				margin-right: 10px;
			}

			input {
				height: 100%;
				padding: 0 25px 0 25px;
				font-size: 14px;
			}
		}
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
			background: url(//s3.music.126.net/mobile-new/img/index_icon_2x.png?5207a28…=) no-repeat;
			background-size: 166px 97px;
			width: 142px;
			height: 67px;
			background-position: -24px -30px;
		}

		.time {
			color: hsla(0, 0%, 100%, 0.8);
			font-size: 12px;
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
			padding-left: 20px;
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
					flex: 0 0 90%;
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
					image {
						width: 25px;
						height: 25px;
						margin-top: 3px;
					}
				}
			}
		}
	}
</style>

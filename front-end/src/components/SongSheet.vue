<template>
	<View class="box">
		<View class='item' @click="go(song_item)">
			<Image lazyLoad :src="picUrl" />
			<!-- <Image class='playIcon' :src="require('../static/play-cell.png')" /> -->
		</View>
		<Text class='name'>{{name}}</Text>
	</View>
</template>

<script>
	export default {
		props: {
			picUrl: String,
			name: String,
			song_item: Object,
		},
		data() {
			return {
				SimilarList: [], //基于物品相似推荐playlist
			}
		},
		methods: {
			go(item) {
				//如歌没有播放歌曲 或者 播放的不是当前歌曲,则播放当前歌曲
				console.log('item值为：', item)
				if (
					!this.$store.state.song ||
					this.$store.state.song.id !== item.song_id
				) {
					this.$store.dispatch("setGlobalData", {
						key: "song",
						value: item
					});
				}
				//改变播放列表
				this.insert_list(item);
				uni.navigateTo({
					url: `/pages/Song/index?id=${item.song_id}`
				});
			},
			/**
			 * 将歌曲插入到正在播放歌曲的后面
			 * @method playAll
			 * @return {undefined}
			 */
			insert_list() {
				// 将热歌全部添加到播放列表里面
				this.$store.dispatch("setGlobalData", {
					key: "songList",
					value: this.SimilarList
				});
				//播放模式切换为顺序播放
				this.$store.dispatch("setGlobalData", {
					key: "mode",
					value: 2
				});
			}
		}
	}
</script>

<style lang='scss' scoped>
	$width : 100%;
	$height: 31vw;

	.box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		width: $width;
		margin-top: 7px;
	}

	image {
		width: $width;
		height: $height;
		border-radius: 10rpx;
	}

	.playIcon {
		position: absolute;
		right: 5%;
		bottom: 5%;
		width: 20px;
		height: 20px;
	}

	.name {
		font-size: 24rpx;
		margin-bottom: 15px;
		margin-top: 5px;
	}

	.item:after {
		content: "";
		flex: auto;
	}
</style>

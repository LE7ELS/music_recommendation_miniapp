<script>
	import baseUrl from "config/index.js"
	
	export default {
		// 应用全局变量
		globalData: {
			/** 
			 * id依次对应歌曲(正确判断过曲风的)：
			 * Clean Bandit - Baby(Raggae)
			 * Lights(Rock)
			 * Drift Away(DnB)
			 * Freaks(Tech Hosue)
			 * Soldier(Trance)
			 * Cuzz的(Downtempo)
			 * 暂无Funky House、Breakbeat
			 */
			BASE_TRACK_ID: ['1356599585', '17654232', '486814457', '1432459395', '28381276', '1436888094'],
			LOGIN_STATUS: false, //登录状态，false为未登录，true为已登录
			USER_INFO: {
				USER_NAME: '', //当前登录的用户名
				USER_ID: '' //当前登录的用户的id   root：b64cdd1a0bd907e5e00b39e345194768e330d652
			}
		},
		onLaunch: function() {
			let audio = uni.getBackgroundAudioManager();

			//播放完毕事件
			audio.onEnded(() => {
				let STATE = this.$store.state;
				if (STATE.mode === 1) {
					//单曲循环则重新播放;
					audio.src = baseUrl.serverUrl + STATE.song.src;
					audio.coverImgUrl = STATE.song.album_picture;
					audio.singer = STATE.song.artist_name;
					audio.title = STATE.song.song_name;
					audio.id = STATE.song.song_id;
				} else if (STATE.mode === 2) {
					//顺序播放则播放下一首
					for (let [index, item] of STATE.songList.entries()) {
						if (item.id === STATE.song.id) {
							//如果当前歌曲是播放列表最后一首则播放第一首;
							if (index === STATE.songList.length - 1) {
								//初始化全局的背景音频播放器
								this.$store.dispatch("update", {
									item: STATE.songList[0]
								});
							} else {
								this.$store.dispatch("update", {
									item: STATE.songList[index + 1]
								});
							}
							return;
						}
					}
				} else if (STATE.mode === 3) {
					//随机播放
					let random = Math.floor(Math.random() * STATE.songList.length); //随机产生一个索引
					if (STATE.songList[random].id === STATE.song.id) {
						//如果随机歌曲与当前歌曲相同
						audio.src = STATE.song.src;
						audio.coverImgUrl = STATE.song.al.picUrl;
						audio.singer = STATE.song.ar
							.map(i => {
								return i.name;
							})
							.join(" / ");
						audio.title = STATE.song.name;
						audio.id = STATE.song.id;
					} else {
						this.$store.dispatch("update", {
							item: STATE.songList[random]
						});
					}
				}
			});

			//初始化全局的背景音频播放器
			this.$store.dispatch("setGlobalData", {
				key: "audio",
				value: audio
			});
		},
		onShow: function() {},
		onHide: function() {
			console.log("App Hide");
		}
	};
</script>

<style>
	/*每个页面公共css */
	View,
	Text {
		font-size: 14px;
	}

	image {
		max-width: 100%;
	}

	song-sheet {
		display: inline-block;
		width: 32.5%;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>

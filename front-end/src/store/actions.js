import {
	UPDATE,
	SETGLOBALDATA,
	PREVSONG,
	NEXTSONG
} from './constants.js'
import {
	getPlayingInfo
} from '../api/index'

const actions = {
	// 更新播放的音乐信息
	update({
		commit
	}, payload) {
		let {
			item
		} = payload

		// 获取歌曲详情
		getPlayingInfo({
			song_id: item.id
		}).then(res => {
			console.log("播放的歌曲的详情:", res)
			if (!res.track_data_url) {
				console.log('该首歌曲无法播放')
				uni.showModal({
					title: '抱歉',
					content: '该首歌曲无法播放'
				})
			}

			commit(UPDATE, {
				src: res.track_data_url,
				coverImgUrl: res.album_picture,
				singer: res.artist_name,
				title: res.song_name,
				id: res.song_id,
				_name: res.song_name,
				_singer: res.artist_name,
				_picUrl: res.album_picture,
				song: res,
				callback: payload.callback
			})
		})
	},

	// 设置全局数据
	setGlobalData({
		commit
	}, payload) {
		let {
			item
		} = payload

		commit(SETGLOBALDATA, payload)
	},

	// 上一曲
	prev({
		commit
	}, payload) {
		commit(PREVSONG, payload)
	},

	// 下一曲
	next({
		commit
	}, payload) {
		commit(NEXTSONG, payload)
	}
}

export default actions

import config from '../config/index';

function Api(path, data = {}) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.serverUrl + path,
			data: data,
			header: {
				// 'content-type': 'application/json'
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			success: res => {
				if (res.statusCode >= 200 && res.statusCode <= 300) {
					resolve(res.data);
				} else {
					if (res.errMsg) {
						uni.showToast({
							title: res.errMsg,
							icon: 'none',
							duration: 1000
						});
					} else {
						uni.showToast({
							title: '出错了',
							icon: 'none',
							duration: 1000
						});
						uni.hideLoading();
					}
				}
			},
			fail: err => {
				uni.showToast({
					title: err.errMsg,
					icon: 'none',
					duration: 1000
				});
				uni.hideLoading();
				reject(err);
			}
		});
	});
}
//CNN推荐
const getCNNRecom = (data = {}) => new Api('/page/get_similar_content_track.php', data)
//基于物品的协同过滤推荐
const getSimilar = (data = {}) => new Api('/page/get_similar_song.php', data)
//基于用户的协同过滤推荐
const getUserRecom = (data = {}) => new Api('/page/get_user_recommendation.php', data)
//搜索
const search = (data = {}) => new Api('/page/search_song_f_name.php', data);
//歌曲详情(新接口)
const getSongDetail = (data = {}) => new Api('/page/play_music.php', data);
//歌曲详情(未使用的原接口，用于用户CF推荐)
const getDetail = (data = {}) => new Api('/page/get_music_detail.php', data);

// 获取播放的音乐的信息
const getPlayingInfo = (data = {}) => new Api('/page/get_playing_information_local.php', data);

//热歌榜
const getHot = (data = {}) => new Api('/page/get_hotest_music.php', data);
//用户评分记录
const getRating = (data = {}) => new Api('/page/get_user_rating_all.php', data);
// 添加评分
const addRating = (data = {}) => new Api('/page/add_rating.php', data);
// 获取用户对某首歌的评分
const getOneRating = (data = {}) => new Api('/page/get_user_2_track_rating.php', data);
//注册
const register = (data = {}) => new Api('/page/register.php', data);
//输入时用户冲突检测
const checkUser = (data = {}) => new Api('/page/check_user_name.php', data);
//登录（组件内独立发起请求）
const login = (data = {}) => new Api('/page/login.php', data);
//获取用户信息（组件内独立发起请求）
const getUserInfo = (data = {}) => new Api('/page/_get_userinfor.php', data);
//退出登录（组件内独立发起请求）
const logout = (data = {}) => new Api('/page/logout.php?action=logout', data);

export {
	getCNNRecom,
	getSimilar,
	getUserRecom,
	search,
	getHot,
	getSongDetail,
	getPlayingInfo,
	getDetail,
	getUserInfo,
	getRating,
	getOneRating,
	addRating,
	register,
	login,
	logout,
	checkUser
};

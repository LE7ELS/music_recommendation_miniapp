# 基于深度学习的音乐推荐小程序

## 环境说明

- Python

  推荐使用 `Anaconda` 作为Python基础环境，推荐前往 [清华大学镜像下载](https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/) 最新版安装包。为避免多个Python环境造成的相互冲突等问题，建议使用Python虚拟环境进行管理。步骤如下：
  1. 打开Anconda终端或者cmd，使用命令 `conda create -n MRC python=3.6.5` 创建一个名为 `MRC` 的Python虚拟环境（MRC即Music Recommendation的缩写）；
  2. 输入 `conda activate MRC` 激活 `MRC` 虚拟环境，在此虚拟环境下安装需要的Python第三方库；
  3. 使用命令 `conda install --yes --file requirements.txt` 批量所需的Python组件依赖（ `requirements.txt` 文件在 `back-end\recommend_service` 目录下，建议上述步骤可在该目录下进行），对于有些安装失败的可单独使用 `conda` 命令或 `pip` 命令安装；
  4. 至此项目所需的Python环境安装完成。

- SoX

  `SoX` 是开源的音频处理软件，本项目使用该工具处理音频文件。本项目 `tools` 目录下已提供Windows安装包，安装教程参考 [这篇文章](https://blog.csdn.net/qq_35547879/article/details/79700591)，并注意 [将SoX添加到环境变量](https://github.com/JoFrhwld/FAVE/wiki/Sox-on-Windows)。

- WAMP

  WAMP环境即 `Windows操作系统`、`Apache服务器`、`MySQL数据库` 以及 `PHP语言`，可直接使用 [phpStudy](https://www.xp.cn/) 或者 [appserv](https://www.appserv.org/) 等集成环境一键安装。Linux操作系统请自行安装相应的 `LAMP` 环境。
  
  MySQL数据库环境需要进行如下设置，新建名为 `music_recommender` 的数据库，数据库用户名为 `music_system`，密码为 `music_system`，**并注意给予相应的数据库访问权限**，然后导入 `back-end\DataBase` 目录下的 `music_recommender.sql` 文件中的数据。推荐使用开源的数据库管理客户端 [HeidiSQL](https://www.heidisql.com/) 管理数据库。

- Node.js

  前端开发环境所需依赖，前往 [官网下载](https://nodejs.org/en/download/) 最新稳定版安装包进行安装。安装Node环境后打开终端命令行并且切换到 `front-end` 目录下，使用命令 `npm install` 安装前端依赖，出现安装失败问题可尝试 `设置淘宝镜像源` 或者使用 `yarn/cnpm` 等方式。

- 前端开发工具
  
  - HBuilderX

    由于小程序使用 `uni-app` 框架开发，故配合使用 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 进行开发能够更加便捷的开发和操作，具体开发步骤、调试技巧等参考 [uni-app文档](https://uniapp.dcloud.io/quickstart)。

  - 微信开发者工具
    
    下载地址：[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

---
## 运行说明
- 后台服务端部署

  将 `back-end` 整个目录移动到 `WAMP` 环境安装目录的 `www` 目录下，并将目录重命名为 `MRC` 以保证和前端的请求 `url` 相同。

- 启动推荐服务

  使用 `Anconda终端`或者 `命令行` 切换到 `back-end\recommend_service` 或者 `MRC\recommend_service` 目录下，运行命令 `conda activate MRC` 激活 `MRC` 虚拟环境，激活环境后输入 `python recommend_service.py` 运行推荐脚本。

- 运行小程序

  使用 `HBuilderX` 打开 `front-end` 目录，**（可选、推荐：将小程序的appID更换为自己的appID）**，点击工具栏的 `运行` → `运行到小程序模拟器` → `微信开发者工具`，`uni-app` 框架将自动打包项目在 `dist\dev` 目录下生成为原生微信小程序项目 `mp-weixin`，并自动运行 `微信开发者工具` 打开项目，即可在 `微信开发者工具` 中查看运行结果。

---
## 常见问题
- SoX报错
  
  对于 `Windows` 系统下可能会出现的 `Unable to load MAD decoder library (libmad) function` 错误，解决方法可参考 [这个问题的答案](https://stackoverflow.com/questions/3537155/sox-fail-util-unable-to-load-mad-decoder-library-libmad-function-mad-stream)。此报错只需将 `tools` 目录下提供的两个库文件，放到 `SoX` 安装目录下即可。

- 小程序无内容

  1. 如出现推荐无内容，需确保推荐脚本 `recommend_service.py` 已正常运行；
  2. 确保 `front-end` 项目代码下的 `src\config\index.js` 文件中对应的 `url` 地址与实际环境的 `url` 地址一致，包括端口等；
  3. 如出现搜索无内容，需确保当前计算机正常联网，以便能正常获取网易云音乐的数据。

- HBuilderX无法自动运行微信开发者工具

  若出现无法自动运行 `微信开发者工具` 的情况可提前手动运行工具或者参考这个 [解决方案](https://ask.dcloud.net.cn/article/35504)。
  
- 小程序真机运行无内容

  想要在真机环境下运行小程序，可将 `back-end` 目录部署到远程服务器或者将本地计算机与手机处在同一局域网内，并在 `front-end` 项目代码下的 `src\config\index.js` 文件中对应的 `url` 地址替换成相应的地址。

---
## 参考项目
  
1. [基于协同过滤算法和深度学习的音乐推荐](https://github.com/MakingL/music_recommendation/tree/master)
2. [使用uni-app开发网易云小程序版本](https://github.com/CalmHarbin/uni-app-music)
3. [私人定制——使用深度学习Keras和TensorFlow打造一款音乐推荐系统](https://zhuanlan.zhihu.com/p/28310437)

---
### 特别感谢 [基于协同过滤算法和深度学习的音乐推荐](https://blog.csdn.net/makingLJ/article/details/86320424) 项目 [作者](https://me.csdn.net/makingLJ) 的指点和帮助！
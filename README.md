# anki-twitter-bot

一个定时发布 anki 卡片的 twitter 机器人

## 部署

首先`npm install`

### 更新下 serverless.yml

- 更新 s3 上的 bucket name
- 更新需要的定时

### 根目录上创建一个`.env`文件

内容添加如下：

```
DECK_KEY=anki包存储在s3上的键值
TWITTER_API_KEY=推特开发者平台上获取
TWITTER_SECRET_KEY=推特开发者平台上获取
TWITTER_ACCESS_TOKEN=推特开发者平台上获取
TWITTER_ACCESS_TOKEN_SECRET=推特开发者平台上获取
```

### 部署到 AWS

linux 环境就直接`sls deploy`

非 linux 环境可以通过 codebuild 来 build 包，bin 文件夹下有 cloudformation 模版文件和相关脚本可以参考。

## TODO

- 支持图片媒体文件
- 在 lambda 限制下支持较大的 anki 包
- 增加命令行配置/图形界面配置工具
- 增加一个将 md 文档转换生成 anki 包的工具

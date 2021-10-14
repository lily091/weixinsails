module.exports = {

  getUserInfo: async function (req, res) {
    let code = req.query.code;
    const url = `https://api.weixin.qq.com/sns/jscode2session`;

    const superAgent = require('superagent');
    superAgent.get(url)
      .query({
        appid: 'wx6117f30892b20fb9',
        secret: '204cbab57ffa934a303a57c7acdce257',//密钥
        js_code: code,
        grant_type: 'authorization_code'
      })
      .end((err, obj) =>{
        res.json((JSON.parse(obj.text)).openid)
      });
    //console.log(code);
    //res.json('999');
  },
  // 获取文章列表
  getArt: async function (req, res) {
    let skip = req.query.start;
    let pageSize = req.query.pageSize;
    const arr = await Article.find().sort('id desc').skip(skip).limit(pageSize);
    res.json(arr)

  },
  // 获取某文章详情
  getArtId: async function (req, res) {
    let id = req.query.id;
    const obj = await Article.findOne({id});
    const num = await Comment.count({'articleId':id});
    res.json({obj,num})

  },
  receive: function(req, res) {
    req.file('file').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/upload')
        },
        function(err, files) {
            if (err)
                return res.serverError(err);
            if (files.length === 0)
                return res.json(false);
            let filePath = files[0].fd.split('\\');
            filePath = filePath[filePath.length - 1];
            res.json(filePath);
        });
},
//批量音频数据添加
insertAudio: async function (req, res) {
  let arr1 = ['pachelbel','好久不见','天空之城','E8r钢琴曲','蓝色多瑙河','月半小夜曲','梦中的婚礼','下一秒 ','遇见','上古情歌桃花诺','我在那一角落患过伤风','LOVE theme from TIGA','《夜色钢琴曲》爱的罗曼史'];
  let arr = [];
  for (let i = 1; i < 14; i++) {
    let json= {};
    json.title= arr1[i-1];
    json.url='audio/audio'+i+'.mp3';
    json.dataType='one';
    json.smallSrc='rouseimg/'+parseInt(Math.random()*17+1)+'.jpeg'
    arr.push(json)
  }
  const temp = await Audio.createEach(arr).fetch()
  res.json(temp);

},
//批量视频数据添加
insertVideo: async function (req, res) {
  let arr = [];
  for (let i = 1; i < 35; i++) {
    let json= {};
    json.title= '《知否知否》第'+i+'集';
    json.url='起风了.mp4';
    json.dataType='zfzf';
    json.smallSrc='rouseimg/'+parseInt(Math.random()*17+1)+'.jpeg'
    arr.push(json)
  }
  const temp = await Video.createEach(arr).fetch()
  res.json(temp);

},
mediaData: async function (req, res) {
  const srcType = req.query.srcType;//音频视频
  const dataType = req.query.dataType;//音频或视频的哪一类
  const records = req.query.records;
  const num = req.query.num;
  if(srcType=="audio"){
    // 音频查询
    const arr = await Audio.find({ dataType }).sort('id asc').skip(records).limit(num);
    res.json(arr)
  }else{
    // 视频查询
    const arr = await Video.find({ dataType }).sort('id asc').skip(records).limit(num);
    res.json(arr)
  }

},
//播放一首歌曲
getAudioId: async function (req, res) {
  let id = req.query.id;
  const obj = await Audio.findOne({id});
  res.json(obj)
},
// 获取前一首歌曲
getAudioPrev: async function (req, res) {
  let dataType = req.query.dataType;
  let id = req.query.id;
  const arr = await Audio.find({id:{'<':id},dataType}).sort('id desc').limit(1);
  if (arr.length) {
    res.json(arr[0]);
  }else{
     res.json(false);
  }
},
// 获取后一首歌曲
getAudioNext: async function (req, res) {
  let id = req.query.id;
  let dataType = req.query.dataType;
  const arr = await Audio.find({id:{'>':id},dataType}).sort('id asc').limit(1);
  if (arr.length) {
    res.json(arr[0]);
  }else{
    res.json(false);
  }
},
//播放一个视频
getVideoId: async function (req, res) {
  let id = req.query.id;
  const obj = await Video.findOne({id});
  res.json(obj)
},
// 获取前一集视频
getVideoPrev: async function (req, res) {
  let dataType = req.query.dataType;
  let id = req.query.id;
  const arr = await Video.find({id:{'<':id},dataType}).sort('id desc').limit(1);
  if (arr.length) {
    res.json(arr[0]);
  }else{
     res.json(false);
  }
},
// 获取后一集视频
getVideoNext: async function (req, res) {
  let id = req.query.id;
  let dataType = req.query.dataType;
  const arr = await Video.find({id:{'>':id},dataType}).sort('id asc').limit(1);
  if (arr.length) {
    res.json(arr[0]);
  }else{
    res.json(false);
  }
},
// 评论图片接收
receiveImg: function(req, res) {
  req.file('file').upload({
          dirname: require('path').resolve(sails.config.appPath, 'assets/photos')
      },
      function(err, files) {
          if (err)
              return res.serverError(err);
          if (files.length === 0)
              return res.json(false);
          let filePath = files[0].fd.split('\\');
          filePath = filePath[filePath.length - 1];
          res.json(filePath);
      });
},
// 评论存入数据库
postComment: async function(req,res){
  const json = req.allParams();
  const obj = await Comment.create(json).fetch();
  res.json(obj)
},
// 获取评论
  getComment: async function (req, res) {
    const articleId=req.query.articleId;
    const skip=req.query.skip;
    const pageSize=req.query.pageSize;
    const arr=await Comment.find({articleId}).sort('id desc').skip(skip).limit(pageSize);
    res.json(arr);
  },
  // 添加播放记录
addPlayRecord: async function (req, res) {
  const json = req.allParams();
  const mediaId = json.mediaId;
  const srcType = json.srcType;
  const delRecord = await User.destroy({mediaId,srcType}).fetch();
  console.log(delRecord);
  const arr = await User.create(json).fetch();
  res.json(arr);
},
// 获取记录
getRecord: async function (req, res) {
  const openId=req.query.openId;
  const arr = await User.find({openId}).sort('id desc');
  res.json(arr);
},
// 搜索
getSearchData: async function (req, res) {
  const keyword=req.query.keyword;
  const arr = await Article.find({title:{contains:keyword}}).sort('id desc');
  res.json(arr);
},
// topic图片接收
topiceImg: function(req, res) {
  req.file('file').upload({
          dirname: require('path').resolve(sails.config.appPath, 'assets/topics')
      },
      function(err, files) {
          if (err)
              return res.serverError(err);
          if (files.length === 0)
              return res.json(false);
          let filePath = files[0].fd.split('\\');
          filePath = filePath[filePath.length - 1];
          res.json(filePath);
      });
},
// topic存入数据库
postTopic: async function(req,res){
  const json = req.allParams();
  const obj = await Topic.create(json).fetch();
  res.json(obj)
},

};


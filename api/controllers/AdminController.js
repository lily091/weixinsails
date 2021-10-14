function changeTime(t) {
  let d = new Date(t);
  return d.toLocaleDateString()
  }
module.exports = {
  index: async function (req, res) {
    res.view({layout:false});
  },
  // 图片添加入库
  addArticle: async function (req, res) {
    req.file('smallSrc').upload({  //链式操作
        dirname:require('path').resolve(sails.config.appPath,'assets/smallSrc')
      },
      async function(err,files) {
        if(err)
          return res.serverError(err);
        if (files.length===0)
          return res.json(false);
        let smallImg=files[0].fd.split('\\');
        smallImg=smallImg[smallImg.length-1];
        let json=req.allParams();
        json.smallSrc=smallImg;
        let row=await Article.create(json).fetch();
        res.json(row);
      });
  },
  // 添加图片
  newImg: function (req, res) {
    req.file('image').upload({
      dirName:require('path').resolve(sails.config.appPath,'assets/upload')
    },
    function(err,files){
      if(err)
        return res.serverError(err);
      if(files.length === 0)
        return res.json(false);
      let path = files[0].fd.split('\\');
      path = path[path.length - 1];
      res.json(path);//发送数据到前端
    });
  },
  select: async function(req, res) {
    let keyword = req.query.title;
    let arr = await Article.find({ where: { title: { contains: keyword } } }).sort('id desc').limit(5);
    arr = arr.map(el => {
        el.date = changeTime(el.updatedAt);
        return el
    })
    res.json(arr)
},
selectId: async function(req, res) {
    let id = req.query.id;
    let obj = await Article.findOne({ id });
    res.json(obj)
},
changeNew: async function(req, res) {
    let id = req.body.id;
    let title = req.body.title;
    let content = req.body.content;
    let obj = await Article.update({ id }, { title, content }).fetch();
    res.json(obj)
},
audioList: async function(req, res) {
  let pageNum = req.query.pageNum;
  let dataType = req.query.dataType;
  req.session.dataType = dataType;
  let arr = await Audio.find({dataType}).sort('id asc').skip(pageNum*5).limit(5);
  let num = await Audio.count({dataType});
  res.json({arr,num})
},
delAudio: async function(req, res) {
 // let delFile = require('fs');
  let id = req.query.id;
  let dataType = req.session.dataType;
  try {
    let row = await Audio.destroy({id}).fetch();
    let count1 = await Audio.count({dataType});
    res.json(count1);
  } catch (error) {
    res.json(false);
  }
},
};


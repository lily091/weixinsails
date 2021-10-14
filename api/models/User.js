/**
 * Article.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    openId:{type:'string',required:true},
    srcType:{type:'text',required:true},
    playTime:{type:'string',required:true},
    mediaId:{type:'string',required:true},
    title:{type:'string',required:true}
  },

};


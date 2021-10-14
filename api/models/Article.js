/**
 * Article.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title:{type:'string',required:true},
    content:{type:'text',required:true},
    smallSrc:{type:'string',required:true},
  },

};

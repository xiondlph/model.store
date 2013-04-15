/**!
 * Cookie module
 *
 * @package    ismax
 * @subpackage library
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Модуль работы с кукис
 **/

// Объявление модулей
var crypto  = require('crypto');

// Парсинг строки кукиса в объект
exports.parse = function(str){
  if(!str){
    return str
  }

  var obj = {}
    , pairs = str.split(/[;,] */);
  for (var i = 0, len = pairs.length; i < len; ++i) {
    var pair = pairs[i]
      , eqlIndex = pair.indexOf('=')
      , key = pair.substr(0, eqlIndex).trim()
      , val = pair.substr(++eqlIndex, pair.length).trim();

    // quoted values
    if ('"' == val[0]) val = val.slice(1, -1);

    // only assign once
    if (undefined == obj[key]) {
      val = val.replace(/\+/g, ' ');
      try {
        obj[key] = decodeURIComponent(val);
      } catch (err) {
        if (err instanceof URIError) {
          obj[key] = val;
        } else {
          throw err;
        }
      }
    }
  }
  return obj;
};

/**
 * Формирования уникального
 * хеша в 16-ричином формате
 */
exports.uid = function(len){
  var buff = crypto.randomBytes(Math.ceil(len * 3 / 4))
      .toString('base64')
      .slice(0, len);
  var uid = crypto.createHmac('sha256', buff).digest('hex');
  return uid;
}
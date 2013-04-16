/**
 * Secure model
 *
 * @package    ismax
 * @subpackage Panel host
 * @author     Xiondlph <admin@ismax.ru>
 */

/**!
 * Модель данных
 * системой безопастности
 **/

// Объявление модулей
var mongo         = require('../../../lib/db');

// Получения данных профиля по id
exports.getProfile = function(httpErr, id, accept){
  mongo.db.collection('operators', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.findOne({_id: id}, httpErr.bind(function(err, profile){
      if(err){
        throw new Error('Mongo error - '+err.message);
        return;
      }

      if(typeof accept == 'function'){
        accept(profile);
      }
    }));
  }));
};

// Обновление данных профиля по id
exports.updateProfile = function(httpErr, id, accept){
  mongo.db.collection('operators', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.update({_id: id}, {
      $set: {
        
      }
    }, httpErr.bind(function(err, result){
      if(err){
        throw new Error('Mongo error - '+err.message);
        return;
      }

      if(typeof accept == 'function'){
        accept(result);
      }
    }));
  }));
};

// Проверка уникальности по Email
exports.isExistByEmail = function(httpErr, email, accept){
  mongo.db.collection('operators', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);      
      return;
    }

    collection.count({email: email}, httpErr.bind(function(err, count){
      if(err){
        throw new Error('Mongo error - '+err.message);
        return;
      }

      if(typeof accept == 'function'){
        accept(count);
      }
    }));
  }));
}
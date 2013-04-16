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

// Получения пользователя по индексу сессии
exports.getUserBySession = function(httpErr, index, accept){
  mongo.db.collection('operators', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.findOne({'sid': index}, httpErr.bind(function(err, user){
      if(err){
        throw new Error('Mongo error - '+err.message);
        return;
      }

      if(typeof accept == 'function'){
        accept(user);
      }
    }));
  }));  
};

// Получения пользователя по Email
exports.getUserByEmail = function(httpErr, email, accept){
  mongo.db.collection('operators', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.findOne({'email': email}, httpErr.bind(function(err, user){
      if(err){
        throw new Error('Mongo error - '+err.message);
        return;
      }

      if(typeof accept == 'function'){
        accept(user);
      }
    }));
  }));  
};

// Установка хеша текущей сессии для пользователя
exports.setSession = function(httpErr, email, index, accept){
  mongo.db.collection('operators', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.update({'email': email}, {$set: {sid: index}}, httpErr.bind(function(err, result){
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

// Удаление хеша текущей сессии для пользователя
exports.unsetSession = function(httpErr, index, accept){
  mongo.db.collection('operators', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.update({'sid': index}, {$unset: {sid: index}}, httpErr.bind(function(err, result){
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

// Установка нового пароля для пользователя
exports.setPassword = function(httpErr, id, password, accept){
  mongo.db.collection('operators', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.update({_id: id}, {$set: {password: password}}, httpErr.bind(function(err, result){
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
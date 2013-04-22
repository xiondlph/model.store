/**
 * Category model
 *
 * @package    ismax
 * @subpackage Panel host
 * @author     Xiondlph <admin@ismax.ru>
 */

/**!
 * Модель данных
 * категории
 **/

// Объявление модулей
var mongo         = require('../../../lib/db');

// Получения списка категорий в заданном узле
exports.getCategoryList = function(httpErr, id, accept){

  try{
    var _parentId = new mongo.bson.ObjectID(id);
  }catch(e){
    var _parentId = (id == 'root') ? 'root' : null;
  }

  mongo.db.collection('category', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.find({parent: _parentId}).toArray(httpErr.bind(function(err, categories){
      if(err){
        throw new Error('Mongo error - '+err.message);
        return;
      }

      if(typeof accept == 'function'){
        accept(categories);
      }
    }));
  }));
};

// Вставка категории в заданный узел
exports.insertCategory = function(httpErr, parentId, values, accept){
  try{
    var _parentId = new mongo.bson.ObjectID(parentId);
  }catch(e){
    var _parentId = null;
  }

  mongo.db.collection('category', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.findOne({_id: _parentId}, httpErr.bind(function(err, parent){
      if(err){
        throw new Error('Mongo error - '+err.message);
        return;
      }

      if(parent){
        var ancestors = parent.ancestors;
        ancestors.push(parent._id);

        collection.insert({
          name: values.name,
          ancestors: ancestors,
          parent: parent._id
        }, httpErr.bind(function(err, category){
          if(err){
            throw new Error('Mongo error - '+err.message);
            return;
          }
    
          if(typeof accept == 'function'){
            accept(category);
          }
        }));
      }else{
        if(typeof accept == 'function'){
          accept(false);
        }
      }
    }));
  }));
};

// Обновление данных категории в заданном узле
exports.updateCategory = function(httpErr, id, values, accept){
  try{
    var _id = new mongo.bson.ObjectID(id);
  }catch(e){
    var _id = null;
  }
  mongo.db.collection('category', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }
    
    collection.update({_id: _id}, { $set: {
      name: values.name,
    }}, httpErr.bind(function(err, result){
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

// Перемещение категории
exports.moveCategory = function(httpErr, parentId, id, accept){
  try{
    var _parentId   = new mongo.bson.ObjectID(parentId);
    var _id         = new mongo.bson.ObjectID(id);
  }catch(e){
    var _parentId   = null;
    var _id         = null;
  }

  mongo.db.collection('category', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.findOne({_id: _id}, httpErr.bind(function(err, category){
      if(err){
        throw new Error('Mongo error - '+err.message);
        return;
      }

      if(category){
        collection.findOne({_id: _parentId}, httpErr.bind(function(err, parent){
          if(err){
            throw new Error('Mongo error - '+err.message);
            return;
          }

          if(parent){
            collection.update({ancestors: _id}, {$set: {move: 1}, $pullAll: {ancestors: category.ancestors}}, {multi: true}, httpErr.bind(function(err, result){
              if(err){
                throw new Error('Mongo error - '+err.message);
                return;
              }

              var ancestors = parent.ancestors;
              ancestors.push(parent._id);
      
              collection.update({_id: _id}, { $set: {
                parent: parent._id,
                ancestors: ancestors
              }}, httpErr.bind(function(err, result){
                if(err){
                  throw new Error('Mongo error - '+err.message);
                  return;
                }

                var cursor = collection.find({ancestors: _id});
                function loop(cursor){
                  cursor.nextObject(httpErr.bind(function(err, child){
                    if(child){
                      var path = ancestors;
                      path.push(child.ancestors);
                      collection.update({_id: child._id}, {$unset: {move: 1}, $set: {ancestors: path}}, httpErr.bind(function(err, result){
                        if(err){
                          throw new Error('Mongo error - '+err.message);
                          return;
                        }

                        loop(cursor);
                      }));
                    }else{
                      if(typeof accept == 'function'){
                        accept(result);
                      }
                    }
                  }))
                };
                
                loop(cursor);
              }));

            }));
          }else{
            if(typeof accept == 'function'){
              accept(0);
            }
          }
        }));
      }else{
        if(typeof accept == 'function'){
          accept(0);
        }
      }
    }));
  }));
};

// Удаление категории по заданному id
exports.removeCategory = function(httpErr, id, accept){
  try{
    var _id = new mongo.bson.ObjectID(id);
  }catch(e){
    var _id = null;
  }
  mongo.db.collection('category', httpErr.bind(function(err, collection){
    if(err){
      throw new Error('Mongo error - '+err.message);
      return;
    }

    collection.remove({$or: [{_id: _id}, {ancestors: _id}]}, httpErr.bind(function(err, result){
      if(err){
        throw new Error('Mongo error - '+err.message);
        return;
      }

      if(typeof accept == 'function'){
        accept(result);
      }
    }));
  }));
}
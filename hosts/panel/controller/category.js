/**
 * Category controller
 *
 * @package    ismax
 * @subpackage Panel host
 * @author     Xiondlph <admin@ismax.ru>
 */

/**!
 * Контроллер управления
 * категориями
 **/
 
 // Объявление модулей
var querystring   = require('querystring'),
    model         = require('../model/category'),
    patterns      = require('../../../lib/patterns'),
    json          = require('../../../lib/json');

//---------------------- HTTP запросы ----------------------//

// Получения списка категорий
exports.list = function(httpErr, req, res){
  var data = querystring.parse(req.url);

  model.getCategoryList(httpErr, data.id, function(categories){
      var response = {
        auth: true,
        success: true,
        categories: categories
      };
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application-json; charset=utf8');
      res.write(JSON.stringify(response, null, "\t"));
      res.end();
  })
},

// Вставка категории
exports.insert = function(httpErr, req, res){
  var data = json.parse(req.post);

  if(data){    
    model.insertCategory(httpErr, data.parentId, data.values, function(category){
      
      var response = {
        auth: true,
        success: true,
        category: category[0]
      };
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application-json; charset=utf8');
      res.write(JSON.stringify(response, null, "\t"));
      res.end();
    });
  }else{
    var response = {
      auth: true,
      success: false
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application-json; charset=utf8');
    res.write(JSON.stringify(response, null, "\t"));
    res.end();
  }
};

// Обновление категории
exports.update = function(httpErr, req, res){
  var data = json.parse(req.post);

  if(data){
    model.updateCategory(httpErr, data.id, data.values, function(result){
      var response = {
        auth: true,
        success: true,
        result: result
      };
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application-json; charset=utf8');
      res.write(JSON.stringify(response, null, "\t"));
      res.end();
    });
  }else{
    var response = {
      auth: true,
      success: false
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application-json; charset=utf8');
    res.write(JSON.stringify(response, null, "\t"));
    res.end();
  }
};

// Перемещение категории
exports.move = function(httpErr, req, res){
  var data = json.parse(req.post);

  if(data){
    model.moveCategory(httpErr, data.parentId, data.id, function(result){
      var response = {
        auth: true,
        success: true,
        result: result
      };
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application-json; charset=utf8');
      res.write(JSON.stringify(response, null, "\t"));
      res.end();
    });
  }else{
    var response = {
      auth: true,
      success: false
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application-json; charset=utf8');
    res.write(JSON.stringify(response, null, "\t"));
    res.end();
  }
}

// Удаление категории
exports.remove = function(httpErr, req, res){
  var data = json.parse(req.post);

  if(data){
    model.removeCategory(httpErr, data.id, function(result){
      var response = {
        auth: true,
        success: true
      };
  
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application-json; charset=utf8');
      res.write(JSON.stringify(response, null, "\t"));
      res.end();
    });
  }else{
    var response = {
      auth: true,
      success: false
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application-json; charset=utf8');
    res.write(JSON.stringify(response, null, "\t"));
    res.end();
  }
};
//--------------------- Socket запросы ---------------------//
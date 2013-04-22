/**
 * Secure controller
 *
 * @package    ismax
 * @subpackage Panel host
 * @author     Xiondlph <admin@ismax.ru>
 */

/**!
 * Контроллер управления,
 * системой безопастности
 **/

// Объявление модулей
var crypto        = require('crypto'),
    model         = require('../model/secure'),
    cookie        = require('../../../lib/cookie'),
    patterns      = require('../../../lib/patterns'),
    json          = require('../../../lib/json');

//---------------------- HTTP запросы ----------------------//

// Проверка авторизации
exports.isAuth = function(httpErr, req, res){
  var response = {
    auth: true
  }
  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application-json; charset=utf8');
  res.write(JSON.stringify(response, null, "\t"));
  res.end();
  return;
};

// Авторизация
exports.signin = function(httpErr, req, res){
  var data = json.parse(req.post);

  if(data){

    // Работа с индексом сессии
    var _cookie = cookie.parse(req.headers.cookie);
    var index  = (_cookie) ? _cookie.ismax_session : '';
  
    if(!patterns.email.test(data.email)){
      throw new Error('Validate error - email is invalid');
    }
  
    model.getUserByEmail(httpErr, data.email, function(user){
      if(!user){
        var response = {
          auth: false
        }
  
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application-json; charset=utf8');
        res.write(JSON.stringify(response, null, "\t"));
        res.end();
  
        return;
      }
  
      if(crypto.createHmac('sha256', data.password).digest('hex') != user.password){
        var response = {
          auth: false
        }
  
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application-json; charset=utf8');
        res.write(JSON.stringify(response, null, "\t"));
        res.end();
  
        return
      }
      
      model.setSession(httpErr, data.email, index, function(result){
        var response = {
          auth: true
        }
  
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application-json; charset=utf8');
        res.write(JSON.stringify(response, null, "\t"));
        res.end();
      });
    });    
  }else{
    var response = {
      auth: false,
      success: false
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application-json; charset=utf8');
    res.write(JSON.stringify(response, null, "\t"));
    res.end();
  }
};

// Выход из сессии
exports.signout = function(httpErr, req, res){
  // Работа с индексом сессии
  var _cookie = cookie.parse(req.headers.cookie);
  var index  = (_cookie) ? _cookie.ismax_session : '';

  model.unsetSession(httpErr, index, function(result){
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  });
};

// Проверка авторизации
exports.auth = function(httpErr, req, res, next){
  // Работа с индексом сессии
  var _cookie = cookie.parse(req.headers.cookie);
  var index  = (_cookie) ? _cookie.ismax_session : '';

  if(index == ''){
    var response = {
      auth: false
    }
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application-json; charset=utf8');
    res.write(JSON.stringify(response, null, "\t"));
    res.end();
    return;
  }
  
  model.getUserBySession(httpErr, index, function(user){
    if(!user){
      var response = {
        auth: false
      }
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application-json; charset=utf8');
      res.write(JSON.stringify(response, null, "\t"));
      res.end();
      return;
    }else{
      req.user = user._id;
      next();
    }
  });
};

// Проверка на НЕ авторизованность
exports.guest = function(httpErr, req, res, next){
  // Работа с индексом сессии
  var _cookie = cookie.parse(req.headers.cookie);
  var index  = (_cookie) ? _cookie.ismax_session : '';

  if(index == ''){
    next();
    return;
  }
  
  model.getUserBySession(httpErr, index, function(user){
    if(!user){
      next();
      return;
    }else{
      var response = {
        auth: true,
        success: false
      }
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application-json; charset=utf8');
      res.write(JSON.stringify(response, null, "\t"));
      res.end();
      return;
    }
  });
};

// Смена текущего пароля
exports.change = function(httpErr, req, res){
  var data = json.parse(req.post);

  if(data){
    var password = crypto.createHmac('sha256', data.password).digest('hex');
    model.setPassword(httpErr, req.user, password, function(result){
      var response = {
        auth: true,
        success: true
      }
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application-json; charset=utf8');
      res.write(JSON.stringify(response, null, "\t"));
      res.end();
    });    
  }else{
    var response = {
      auth: true,
      success: false
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application-json; charset=utf8');
    res.write(JSON.stringify(response, null, "\t"));
    res.end();
  }
}

//--------------------- Socket запросы ---------------------//

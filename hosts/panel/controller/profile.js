/**
 * Profile controller
 *
 * @package    ismax
 * @subpackage Panel host
 * @author     Xiondlph <admin@ismax.ru>
 */

/**!
 * Контроллер управления
 * профилем пользователя
 **/
 
 // Объявление модулей
var model         = require('../model/profile'),
    patterns      = require('../../../lib/patterns'),
    json          = require('../../../lib/json');

//---------------------- HTTP запросы ----------------------//

// Получение данных профиля
exports.get = function(httpErr, req, res){
  model.getProfile(httpErr, req.user, function(profile){
    var response = {
      auth: true,
      success: true,
      profile: profile
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application-json; charset=utf8');
    res.write(JSON.stringify(response, null, "\t"));
    res.end();
  });
};

// Обновление данных профиля
exports.update = function(httpErr, req, res){
  var data = json.parse(req.post);

  if(data){
    if(!patterns.email.test(data.profile.email)){
      throw new Error('Validate error - email is invalid');
    }
    
    model.isExistByEmail(httpErr, data.profile.email, function(count){
      if((count > 0) && (data.last !== data.profile.email)){
        var response = {
          auth: true,
          exist: true
        };
  
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application-json; charset=utf8');
        res.write(JSON.stringify(response, null, "\t"));
        res.end();
      }else{
        model.updateProfile(httpErr, req.user, data.profile, function(result){
          var response = {
            auth: true,
            success: true
          };
  
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application-json; charset=utf8');
          res.write(JSON.stringify(response, null, "\t"));
          res.end();
        });
      }
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
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
var model         = require('../model/profile');

//---------------------- HTTP запросы ----------------------//

// Получение данных профиля
exports.get = function(httpErr, req, res){
  model.getProfile(httpErr, req.user, function(profile){
    var result = {
      auth: true,
      success: true,
      profile: profile
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application-json; charset=utf8');
    res.write(JSON.stringify(result, null, "\t"));
    res.end();
  });
};

// Обновление данных профиля
exports.update = function(httpErr, req, res){
  
};
//--------------------- Socket запросы ---------------------//
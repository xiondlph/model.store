/**!
 * XMLHttpRequest controller
 *
 * @package    ismax
 * @subpackage Panel host
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Контроллер проверки 
 * аякс запросов
 **/

// Объявление модулей
var socket  = require('../../../server/socket');

//---------------------- HTTP запросы ----------------------//

// Проверка аякс запоса
exports.isXhr = function(httpErr, req, res, next){
  if(req.headers['x-requested-with']){
    if(req.headers['x-requested-with'] == 'XMLHttpRequest'){
      next();      
      return;
    }
  }

  res.statusCode = 200;
  res.setHeader('Content-Type','text/html; charset=utf8');
  res.end('no Xhr');
}

//--------------------- Socket запросы ---------------------//
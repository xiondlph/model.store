/**!
 * Index controller
 *
 * @package    ismax
 * @subpackage Panel host
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Index контроллер
 **/

// Объявление модулей
var jade          = require('jade'),
    cookie        = require('../../../lib/cookie'),
    socket        = require('../../../server/socket');

//---------------------- HTTP запросы ----------------------//


// Домашняя страница
exports.index = function(httpErr, req, res){

  // Работа с индексом сессии
  var _cookie = cookie.parse(req.headers.cookie);
  var index  = (_cookie) ? _cookie.ismax_session : '';
  if(index == ''){
    var index = cookie.uid(64);
    res.setHeader("Set-Cookie", 'ismax_session='+index+'; path=/; domain=ismaxonline.com');
  }else{
    res.setHeader("Set-Cookie", 'ismax_session='+index+'; path=/; domain=ismaxonline.com');
  }

  jade.renderFile(__dirname+'/../view/index.jade',{},httpErr.bind(function (err, html){
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf8'
    });
    res.write(html);
    res.end();
  }));
}

//--------------------- Socket запросы ---------------------//
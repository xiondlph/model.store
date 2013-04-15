/**!
 * Index controller
 *
 * @package    ismax
 * @subpackage Base host
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Index контроллер
 **/

// Объявление модулей
var jade    = require('jade'),
    socket  = require('../../../server/socket');

//---------------------- HTTP запросы ----------------------//


// Домашняя страница
exports.index = function(httpErr, req, res){
  jade.renderFile(__dirname+'/../view/index.jade',{},httpErr.bind(function (err, html){
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf8'
    });
    res.write(html);
    res.end();
  }));
}

//--------------------- Socket запросы ---------------------//
/**!
 * Hosts module
 *
 * @package    ismax
 * @subpackage Server
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Модуль маршрутизации
 * по хостам
 **/

// Объявление модулей
var static      = require('node-static'),
    jade        = require('jade'),
    url         = require("url"),
    router      = require('./router');

// Инициализация объекта статики
var file        = new(static.Server)(__dirname+'/../static', {cache: 3600, serverInfo: 'ismax'});

// Объект набора хостов
var host = {}

// Назначение хостов
exports.setHost = function(hostname){
  var _router = new router.router;
  host[hostname] = _router.route;
  return _router;
}

/**
 * Маршрутизация хостов
 */
 var route = function(httpErr, req, res){

  // Блок общей статики
  if( /^\/ext\/*/.test(url.parse(req.url).pathname)){
    file.serve(req, res, httpErr.bind(function(err, result){
      if (err && (err.status === 404)){
        jade.renderFile(__dirname+'/../view/404.jade',{}, httpErr.bind(function (err, html){
          res.writeHead(404, {'Content-Type': 'text/html; charset=utf8'});
          res.write(html);
          res.end();
        }));
      }
    }));

    return;
  }

  // Определения наличия хоста в списке
  if(typeof host[req.headers.host] === 'function'){
    host[req.headers.host](httpErr, req, res);
  }else{
    
    // Рендеринг шаблона 404 ошибки
    jade.renderFile(__dirname+'/../view/404.jade',{}, httpErr.bind(function(err, html){
      res.writeHead(404, {'Content-Type': 'text/html; charset=utf8'});
      res.write(html);
      res.end();
    }));
  }
}

exports.route = route;
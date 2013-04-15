/**!
 * Routing module
 *
 * @package    ismax
 * @subpackage Server
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Модуль маршрутизатор по url
 **/

// Объявление модулей
var static      = require('node-static'),
    url         = require('url'),
    jade        = require('jade'),
    util        = require('util'),
    fs          = require('fs');

/**
 * Объект маршрутизации
 */
var router = function(){

  //Путь до статики
  var staticPath  = __dirname+'/../static';

  // Установка пути до статики
  this.setStaticPath = function(val){
    fs.exists(val, function (exists){
      if(exists){
        staticPath = val;
      }else{
        throw new Error('Path "'+val+'" no exist');
      }
    });
  }

  // Путь до шаблонов
  var viewPath    = __dirname+'/../view/';

  // Установка пути до шаблонов
  this.setViewPath = function(val){
    fs.exists(val, function (exists){
      if(exists){
        viewPath = val;
      }else{
        throw new Error('Path "'+val+'" no exist');
      }
    });
  }

  // Объект набора маршрутов
  var handle = {}
  
  // Назначение функций контроллеров маршрутам
  this.setRoute = function(){
    if(util.isArray(handle[arguments[0]])){
      funcs = handle[arguments[0]];
    }else{
      var funcs = new Array();
    }
  
    for(var i=1;i<arguments.length;i++){
      if(util.isArray(arguments[i])){
        arguments[i].forEach(function(func){
          if(typeof func !== 'function'){
            throw new Error('Argumet id not a function');
          }
        },this);
        funcs = funcs.concat(arguments[i]);
      }else if(typeof arguments[i] !== 'function'){
        throw new Error('Argumet id not a function');
      }else{
        funcs = funcs.concat(arguments[i]);
      }
    }
  
    handle[arguments[0]] = funcs;
  }

  /**
   * Маршрутизация 
   * по хосту
   */
  this.route = function(httpErr, req, res){
    var me    = arguments.callee;
    var _url  = url.parse(req.url);
  
    /**
     * Функция контроля последовательности
     * выполнения функций связанных с маршрутом
     */
    function next(caller){
  
      // Определения наличия марщрута в списке
      if(util.isArray(handle[_url.pathname])){
        var funcs = handle[_url.pathname];
        var index = funcs.indexOf(caller);
  
        if((index < 0) && (me == caller)){
          index = 0;
        }
  
        if(typeof funcs[index] === 'function'){
          funcs[index](httpErr, req, res, function(){
            next(funcs[index+1]);
          });
        }
      }else{
        // Выдача статики в случае 
        // отсудствии подходящего маршрута

        /**
         * Инициализация объекта статики
         * в случае его отсудствия
         **/
        if(!file){
          var file = new(static.Server)(staticPath, { cache: 3600, serverInfo: 'ismax' })
        }

        file.serve(req, res, httpErr.bind(function(err, result){
          if (err && (err.status === 404)){
    
            // Рендеринг шаблона 404 ошибки
            // при отсудствии подходящего файла
            jade.renderFile(viewPath+'404.jade', {}, httpErr.bind(function (err, html){
              res.writeHead(404, {'Content-Type': 'text/html; charset=utf8'});
              res.write(html);
              res.end();
            }));
          }
        })); 
      }
    }
    
    next(arguments.callee);
  }
}

exports.router = router;
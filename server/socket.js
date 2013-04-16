/**!
 * Socket module
 *
 * @package    ismax
 * @subpackage Socket
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Модуль web сокета
 **/

// Объявление модулей
var util          = require('util'),
    io            = require('socket.io'),
    exception     = require('./exception'),
    cookie        = require('../lib/cookie');


// Объект команд
var command = {};

// Назначение функций контроллеров командам
exports.setCommand = function(){
  if(util.isArray(command[arguments[0]])){
    funcs = command[arguments[0]];
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

  command[arguments[0]] = funcs;
}


exports.listen = function(server){
  var sio = io.listen(server);

  /**
  * Начальная конфигурация
  * сокет объекта
  */
  sio.configure(function(){

    sio.enable('browser client minification');
    sio.set('resource','/ismax.io');

    // Режим логирования 1 - warn
    sio.set('log level', 1);

    // Определения транспорта сокет взаимодействия
    //sio.set('transports', ['websocket']);

    // Пред-обработка сокет соединения
    sio.set('authorization', function (data, accept){
      if(data.headers.cookie){
        var _cookie = cookie.parse(data.headers.cookie);
        data.index = _cookie['ismax_session'];
        
      }
      return accept(null, true);
    });
  });


  /**
   * Блок обработки события
   * сокет соединения
   */
  sio.sockets.on('connection',function(socket){

    // Объект перехвата исключений данного соединения
    var socketErr = exception.socketErr(socket);


    /**
     * Обработчик события сокета - command,
     * основное события модели взаимодействия
     */
    socket.on('command', function(data){
      var me = arguments.callee;

      /**
       * Функция контроля последовательности
       * выполнения функций связанных с команой
       */
      function next(caller){

        // Определения наличия команды в списке
        if(util.isArray(command[data.command])){
          var funcs = command[data.command];
          var index = funcs.indexOf(caller);

          if((index < 0) && (me == caller)){
            index = 0;
          }

          if(typeof funcs[index] === 'function'){
            funcs[index](socketErr, sio, socket, data, function(){
              next(funcs[index+1]);
            });
          }
        }
      }
      
      next(arguments.callee);
    });

    // Обработка события потери соединения
    socket.on('disconnect', function(){
      if(typeof socket.handshake.onDisconnect === 'function' ){
        socket.handshake.onDisconnect(socketErr, sio, socket);
      }
    });
  });

  return sio;
};
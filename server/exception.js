/**!
 * Exception module
 *
 * @package    ismax
 * @subpackage Socket
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Модуль перехвата и 
 * обработки исключений
 **/

// Установка количества элементов в стеке исключений = 1
Error.stackTraceLimit = 5;

// Перехват формирования стека ошибок
Error.prepareStackTrace = function(err, stack){
  var log = {
    message:err.message,
    stack:[]
  }

  stack.forEach(function(frame){
    log.stack.push({
      time:     (new Date).toUTCString(),
      file:     frame.getFileName(),
      line:     frame.getLineNumber(),
      column:   frame.getColumnNumber(),
      func:     frame.getFunctionName()
    });
  });

  return JSON.stringify(log, null, "\t");
}

// Перехват брошенного исключения
process.on('uncaughtException', function(err){

  // Запись стека ошибки в лог файл
  fs.open(__dirname+'/../log/error.log', 'a', 0666, function(e, id){
    fs.write(id, err.stack+"\n", null, 'utf8', function(){
      fs.close(id, function(){});
    });
  });

  // Вывод стека ошибок в stderr
  console.error(err.stack);

  //process.exit(1);
});


// Объявление модулей
var domain        = require('domain'),
    fs            = require('fs');


// Экспорт объекта перехвата HTTP исключений
exports.httpErr = function(req, res){
  
  // Объект обработки http исключений
  errHandler = domain.create();
  
  // Добавления объектов запроса ответа
  // в объект обработки исключения
  errHandler.add(req);
  errHandler.add(res);
  
  // Обработка и ответ на брошенное http исключение
  errHandler.on('error', function(err){
    console.log('httpErr');
    try {
      if(req.headers['x-requested-with']){
        if(req.headers['x-requested-with'] == 'XMLHttpRequest'){
          var response = {
            success: false
          }
  
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application-json; charset=utf8');
          res.write(JSON.stringify(response, null, "\t"));
          res.end();
          
          return;
        }
      }

      res.statusCode = 500;
      res.setHeader('Content-Type','text/html; charset=utf8');
      res.end('Internal server error');
    }catch(er){
      console.error('Error sending HTTP response', er, req.url);
    }
  });
  
  return errHandler;
}


// Экспорт объекта перехвата сокет исключений
exports.socketErr = function(socket){

  // Объект обработки сокет исключений
  errHandler = domain.create();

  // Добавления объектов сокета
  // в объект обработки исключения
  errHandler.add(socket);

  // Обработка и ответ на брошенное сокет исключение
  errHandler.on('error', function(err){
    console.log('socketErr');
    try {
      socket.emit('command', {command: 'error'});
      socket.disconnect();
    }catch(er){
      console.error('Error sending socket command', er);
    }
  });
  
  return errHandler;
};
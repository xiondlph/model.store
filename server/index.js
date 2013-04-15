/**!
 * Server application
 *
 * @package    ismax
 * @subpackage Server
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Главный модуль сервера
 **/

// Объявление модулей
var http          = require('http'),
    exception     = require('./exception'),
    hosts         = require('./hosts'),
    socket        = require('./socket');

// Создание HTTP сервера
var server = http.createServer(function(req, res){

  // Объект POST данных
  req.post = '';

  // Принятие POST данных
  req.addListener("data", function(data){
    req.post += data;
  });

  // Обработка запроса при окончании
  // получения данных запроса
  req.addListener('end', function(){

    // Объект перехвата исключений запроса
    var httpErr = exception.httpErr(req, res);

    // Установка http заголовка авторства
    res.setHeader('Server','ismax');
    res.setHeader('X-Powered-By','Xiondlph <admin@ismax.ru>');
    
    httpErr.run(function(){
      hosts.route(httpErr, req, res);
    });
  });
});

// Инициализация хостов
exports.init = function(host){
  return hosts.setHost(host);
};

// Метод запуска сервера
exports.start = function(){

  // Запуск web сервера на порту 3000
  server.listen(3000);

  // Получение объекта сокета и
  // сопряжения его с web сервером
  var io = socket.listen(server);
  
  console.log('Start server at port 3000');
}
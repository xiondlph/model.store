/**!
 * Panel index
 *
 * @package    ismax
 * @subpackage Panel host
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Модуль инициализации хоста
 **/

// Подклучения сервера
var server = require('../../server');

// Нобор контроллеров
var index     = require('./controller/index');
var xhr       = require('./controller/xhr');
var secure    = require('./controller/secure');
var profile   = require('./controller/profile');

// Инициализация хоста
var host = server.init('panel.ismaxonline.com');

//Установка путей для статики и шаблонов
host.setStaticPath(__dirname+'/../../../static/panel');
host.setViewPath(__dirname+'/view/');

// Назначение HTTP маршрутов
host.setRoute('/', index.index);

host.setRoute('/secure/isauth', secure.auth, secure.isAuth);
host.setRoute('/secure/signin', secure.signin);
host.setRoute('/secure/signout', secure.auth, secure.signout);
host.setRoute('/secure/change', secure.auth, secure.change);

host.setRoute('/profile/get', secure.auth, profile.get);
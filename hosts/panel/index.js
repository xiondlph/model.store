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
var category  = require('./controller/category');

// Инициализация хоста
var host = server.init('panel.ismaxonline.com');

//Установка путей для статики и шаблонов
host.setStaticPath(__dirname+'/../../../static/panel');
host.setViewPath(__dirname+'/view/');

// Назначение HTTP маршрутов
host.setRoute('/', index.index);

host.setRoute('/secure/isauth', xhr.isXhr, secure.auth, secure.isAuth);
host.setRoute('/secure/signin', xhr.isXhr, secure.guest, secure.signin);
host.setRoute('/secure/signout', secure.auth, secure.signout);
host.setRoute('/secure/change', xhr.isXhr, secure.auth, secure.change);

host.setRoute('/profile/get', xhr.isXhr, secure.auth, profile.get);
host.setRoute('/profile/update', xhr.isXhr, secure.auth, profile.update);

host.setRoute('/category/list', xhr.isXhr, secure.auth, category.list);
host.setRoute('/category/insert', xhr.isXhr, secure.auth, category.insert);
host.setRoute('/category/update', xhr.isXhr, secure.auth, category.update);
host.setRoute('/category/move', xhr.isXhr, secure.auth, category.move);
host.setRoute('/category/remove', xhr.isXhr, secure.auth, category.remove);
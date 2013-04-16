/**!
 * Base index
 *
 * @package    ismax
 * @subpackage Base host
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Модуль инициализации хоста
 **/

// Подклучения сервера
var server = require('../../server');

// Нобор контроллеров
var index = require('./controller/index');

// Инициализация хоста
var host = server.init('www.ismaxonline.com');

//Установка путей для статики и шаблонов
host.setStaticPath(__dirname+'/../../../static/base');
host.setViewPath(__dirname+'/view/');

// Назначение HTTP маршрутов
host.setRoute('/', index.index);
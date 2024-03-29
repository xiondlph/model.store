/**!
 * Main App
 *
 * @package    ismax
 * @subpackage Main Application
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Главный модуль приложения,
 * - точка входа
 **/

// Подключение сервера
var server        = require('./server');

// Подключение хостов
var index         = require('./hosts/base');
var index         = require('./hosts/panel');

// Запуск сервера
server.start();
/**!
 * Patterns list module
 *
 * @package    ismax
 * @subpackage Server
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Библеотека паттернов
 * регулярных выражений
 **/

// Паттерн числовых значения
exports.number = /\d/;

// Паттерн 16-ричного хеш кода пароля
exports.passHash = /[A-Fa-f0-9]/;

// Паттерн Email
exports.email = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/

// Паттерн логина
exports.login = /[-a-z0-9!#$%&'*+/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*/;
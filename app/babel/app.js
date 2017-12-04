import {message} from './modules/message';
import {create} from './modules/create';

const messages = {
	consoleMessage: message('App Works!')
}

console.info(messages.consoleMessage);
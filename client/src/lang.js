import config from './config.json';
import language from './language.json';

const lang = (component, message) => {
    const langstr = config.language || "en";

    if(!message) return (message) => {
        return language[langstr][component][message];
    }
    
    return language[langstr][component][message];
};

export default lang;
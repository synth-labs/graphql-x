import Arg from './Arg';

type ArgMap = {
    [keys: string]: {
        [keys: string]: Arg
    }
};

export default ArgMap;
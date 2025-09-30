import {Iauth} from '../src/Interface/auth-interface'

declare global{
    namespace Express{
        interface User extends Iauth{}
    }
}

export{}
import {Iauth} from '../src/Interface/auth-interface'

declare global{
    namespace Express{
        interface Request{
          user: Iauth,
          file:Express.Multer.File
        }
    }
}

export {};
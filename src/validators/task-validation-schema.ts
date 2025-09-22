import * as yup from 'yup'

export const TaskFolderTemplate = yup.object({
    taskFolderName: yup.string().lowercase().trim().required(),
    image: yup.mixed<File>().test('image','only images are allowed', (value)=>{
        if(!value){
            return true;
        }
        return ['img/png','img/jpeg'].includes(value.type)
    }).test('size','file too large',(value)=>{
        if(!value){
            return true;
        }
        return value.size <= 5000 *1024*1024
    }).nullable()
});

export const taskTemplate= yup.object({
    files:yup.mixed<File>().test('filetype','only file formats are allowed',(value)=>{
        if(!value){
            return true
        }
        return ['text/plain','application/msword','application/pdf'].includes(value.type)
    })
    .test('filesize','file too large',(value)=>{
        if(!value){
            return true
        }
        return value.size<= 5000 *1024*1024
    }).nullable(),
    description: yup.string().trim(),
    collaborators: yup.string().lowercase().trim(),
    dueDate: yup.date().transform((_,originalvalue)=>{
       const parsed = new Date(originalvalue)
       return isNaN(parsed.getTime()) ? undefined : parsed;
    }).typeError('datatype invalid'),
    dependencies: yup.string().lowercase().trim()
});

export const subTaskTemplate= yup.object({
    files:yup.mixed<File>().test('filetype','only file formats are allowed',(value)=>{
        if(!value){
            return true
        }
        return ['text/plain','application/msword','application/pdf'].includes(value.type)
    })
    .test('filesize','file too large',(value)=>{
        if(!value){
            return true
        }
        return value.size<= 5000 *1024*1024
    }).nullable(),
    description: yup.string().trim(),
    collaborators: yup.string().lowercase().trim(),
    dueDate: yup.date().transform((_,originalvalue)=>{
       const parsed = new Date(originalvalue)
       return isNaN(parsed.getTime()) ? undefined : parsed;
    }).typeError('datatype invalid'),
    dependencies: yup.string().lowercase().trim()
});



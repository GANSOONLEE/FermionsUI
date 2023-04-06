import { ModuleManager } from './module-manager';

const moduleExport = new ModuleManager();

// Register the module

//Core
moduleExport.registerModule('file-logger', './file-logger.ts');

//UI kit


//Additional


export default moduleExport;

import { ModuleManager } from './module-manager';

const moduleExport = new ModuleManager();

// Register the module
moduleExport.registerModule('file-logger', './file-logger.ts');


export default moduleExport;

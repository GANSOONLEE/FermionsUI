"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_manager_1 = require("./module-manager");
const moduleExport = new module_manager_1.ModuleManager();
// Register the module
//Core
moduleExport.registerModule('file-logger', './file-logger.js');
//UI kit
//Additional

exports.default = moduleExport;

//# sourceMappingURL=module-list.js.map
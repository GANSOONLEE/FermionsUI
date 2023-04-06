"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file_logger_1 = __importDefault(require("./file-logger"));
class Module {
    constructor(moduleID, relPath) {
        this.moduleID = moduleID;
        this.path = path_1.default.resolve(__dirname, relPath);
        this.exports = {};
    }
    load() {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = this.path;
        document.head.appendChild(script);
        return new Promise((resolve, reject) => {
            script.onload = () => {
                resolve(this.exports);
            };
            script.onerror = (event) => {
                reject(new Error(`Failed to load module ${this.moduleID} from ${this.path}: ${event}`));
                file_logger_1.default.warn(`Failed to load module "${this.moduleID}"`);
            };
        });
    }
}
class ModuleManager {
    constructor() {
        this.modules = {};
    }
    registerModule(name, relPath) {
        const module = new Module(name, relPath);
        if (fs_1.default.existsSync(module.path)) {
            this.modules[name] = module;
            file_logger_1.default.info(`The module "${name}" is registered.`);
        }
        else {
            file_logger_1.default.warn(`The module "${name}" is not registered because the file path "${module.path}" does not exist.`);
            throw new Error(`Module ${name} not registered because the file path "${module.path}" does not exist.`);
        }
    }
    loadModule(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const module = this.modules[name];
            if (!module) {
                file_logger_1.default.error(`Module ${this.modules} not found`);
                throw new Error(`Module ${this.modules} not found`);
            }
            return yield module.load();
        });
    }
}
exports.ModuleManager = ModuleManager;
const moduleExport = new ModuleManager();
exports.default = moduleExport;
//# sourceMappingURL=module-manager.js.map
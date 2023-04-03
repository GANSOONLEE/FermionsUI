import fs from 'fs';
import path from 'path';
import logger from './file-logger';

interface IManagement {
    moduleID: string;
    path: string;
}

class Module {
    public moduleID: string;
    public path: string;
    public exports: any;

    constructor(moduleID: string, relPath: string) {
        this.moduleID = moduleID;
        this.path = path.resolve(__dirname, relPath);
        this.exports = {};
    }

    public load() {
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
                logger.warn(`Failed to load module "${this.moduleID}"`);
            };
        });
    }
}

export class ModuleManager {
    private modules: { [key: string]: Module } = {};

    public registerModule(name: string, relPath: string) {
        const module = new Module(name, relPath);
        if (fs.existsSync(module.path)) {
            this.modules[name] = module;
            logger.info(`The module "${name}" is registered.`);
        } else {
            logger.warn(`The module "${name}" is not registered because the file path "${module.path}" does not exist.`);
            throw new Error(`Module ${name} not registered because the file path "${module.path}" does not exist.`);
        }
    }

    public async loadModule(name: string) {
        const module = this.modules[name];
        if (!module) {
            logger.error(`Module ${this.modules} not found`);
            throw new Error(`Module ${this.modules} not found`);
        }
        return await module.load();
    }
}

const moduleExport = new ModuleManager()
export default moduleExport;

// Management core module

interface IManagement {
    moduleID: string; // moduleID is unique
    path: string; // path to the module, recommended use the relative path
}

// defined module attributes and methods
class Module {
    public moduleID: string;
    public path: string;
    public exports: any;

    constructor(moduleID: string, path: string) {
        this.moduleID = moduleID;
        this.path = path;
        this.exports = {};
    }

    // load a module
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
            };
        });
    }
}

export class ModuleManager {
    private modules: { [key: string]: Module } = {};

    // Register Module
    public registerModule(name: string, path: string) {
        const module = new Module(name, path);
        this.modules[name] = module;
    }

    // Load a Module
    public async loadModule(name: string) {
        const module = this.modules[name];
        if (!module) {
            throw new Error(`Module ${name} not found`);
        }
        return await module.load();
    }
}

export default {ModuleManager};
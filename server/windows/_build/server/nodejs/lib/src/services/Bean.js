"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Resource_1 = require("../interfaces/Resource");
const Query_1 = require("../resource/Query");
const Directory_1 = require("./Directory");
const writeFileAtomic = require('write-file-atomic');
class BeanService extends Directory_1.DirectoryService {
    constructor(config) {
        super(config.resourceConfiguration);
        this.config = config;
    }
    getMetaData(scope, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.get(scope + '://' + path, false, false, false, null));
        });
    }
    removeGroup($scope, $path) {
        // let $fullPath = this.resolveAbsolute($scope, $path);
        // let errors = [];
        // let success = [];
        /*
        if (is_dir($fullPath)) {
            XApp_File_Utils::deleteDirectoryEx(XApp_Path_Utils::securePath($fullPath), null, null, null, $errors, $success);
        }
        return $errors;
        */
    }
    setContent($scopeName, $path, $content) {
        /*
        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.Path.Utils');
        xapp_import('xapp.VFS.Local');
        xapp_import('xapp.Commons.Exceptions');
        $scope = $this ->getScope($scopeName);
        if ($scope == null) {
            return false;
        }
        $return = null;
        $fullPath = XApp_Path_Utils::normalizePath($this ->resolvePath($scopeName, DIRECTORY_SEPARATOR.$path, null, true, false), true, false);
        if (!file_exists($fullPath)) {
            XApp_File_Utils::createEmptyFile($fullPath);
        }
        $content = xapp_prettyPrint($content);
        if (file_exists($fullPath)) {

            if (!is_writeable($fullPath)) {
                throw new Xapp_Util_Exception_Storage(vsprintf('File: %s is not writable', array(basename($fullPath))), 1640102);
            } else {

                //write out
                $fp = fopen($fullPath, "w");
                fputs($fp, $content);
                fclose($fp);
                clearstatcache(true, $fullPath);
                $return = true;
            }

        } else {
            throw new Xapp_Util_Exception_Storage('unable to write storage to file  :  '.$path. ' at : ' .$fullPath, 1640104);
        }
        return $return;
        */
    }
    _updateItemMetaData(scope = 'user_devices', path = 'House/WebCam.meta.json', dataPath = '/inputs', query = {}, value = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = new Query_1.ResourceQuery(yield this.getMetaData(scope, path));
            const data = resource.set('', dataPath.replace('/', ''), query, value);
            writeFileAtomic.sync(this.resolvePath(scope, path), JSON.stringify(data, null, 4), this.WRITE_MODE);
            return data;
        });
    }
    getItems(path, scope, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    _ls(path, mount, options, recursive = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resource = this.getResourceByTypeAndName(Resource_1.EResourceType.FILE_PROXY, path);
                if (resource) {
                    const root = this.resolveAbsolute(resource);
                    const nodes = yield this.getItems(root, path, {});
                    return { items: nodes };
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.BeanService = BeanService;
//# sourceMappingURL=Bean.js.map
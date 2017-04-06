"use strict";
/**
 * Node types
 *
 * @export
 * @enum {string}
 */
var ENodeType;
(function (ENodeType) {
    ENodeType[ENodeType["FILE"] = 'file'] = "FILE";
    ENodeType[ENodeType["DIR"] = 'dir'] = "DIR";
    ENodeType[ENodeType["SYMLINK"] = 'symlink'] = "SYMLINK";
    ENodeType[ENodeType["OTHER"] = 'other'] = "OTHER";
    ENodeType[ENodeType["BLOCK"] = 'block'] = "BLOCK";
})(ENodeType = exports.ENodeType || (exports.ENodeType = {}));
/**
 * General features of a VFS
 *
 * @export
 * @enum {number}
 */
var EVFSCapabilties;
(function (EVFSCapabilties) {
    EVFSCapabilties[EVFSCapabilties["VERSIONED"] = 0] = "VERSIONED";
    EVFSCapabilties[EVFSCapabilties["CHANGE_MESSAGE"] = 1] = "CHANGE_MESSAGE";
    EVFSCapabilties[EVFSCapabilties["META"] = 2] = "META";
    EVFSCapabilties[EVFSCapabilties["MIME"] = 3] = "MIME";
    EVFSCapabilties[EVFSCapabilties["AUTHORS"] = 4] = "AUTHORS";
    EVFSCapabilties[EVFSCapabilties["META_TREE"] = 5] = "META_TREE"; // VFS has non INode tree nodes (VCS branches, tags, commits,..)
})(EVFSCapabilties = exports.EVFSCapabilties || (exports.EVFSCapabilties = {}));
/**
 *
 * These flags are used to build the result, adaptive.
 * @TODO: sync with dgrid#configureColumn
 * @export
 * @enum {number}
 */
var NODE_FIELDS;
(function (NODE_FIELDS) {
    NODE_FIELDS[NODE_FIELDS["SHOW_ISDIR"] = 1602] = "SHOW_ISDIR";
    NODE_FIELDS[NODE_FIELDS["SHOW_OWNER"] = 1604] = "SHOW_OWNER";
    NODE_FIELDS[NODE_FIELDS["SHOW_MIME"] = 1608] = "SHOW_MIME";
    NODE_FIELDS[NODE_FIELDS["SHOW_SIZE"] = 1616] = "SHOW_SIZE";
    NODE_FIELDS[NODE_FIELDS["SHOW_PERMISSIONS"] = 1632] = "SHOW_PERMISSIONS";
    NODE_FIELDS[NODE_FIELDS["SHOW_TIME"] = 1633] = "SHOW_TIME";
    // @TODO: re-impl. du -ahs/x for windows
    NODE_FIELDS[NODE_FIELDS["SHOW_FOLDER_SIZE"] = 1634] = "SHOW_FOLDER_SIZE";
    NODE_FIELDS[NODE_FIELDS["SHOW_FOLDER_HIDDEN"] = 1635] = "SHOW_FOLDER_HIDDEN";
    NODE_FIELDS[NODE_FIELDS["SHOW_TYPE"] = 1636] = "SHOW_TYPE";
    NODE_FIELDS[NODE_FIELDS["SHOW_MEDIA_INFO"] = 1637] = "SHOW_MEDIA_INFO";
})(NODE_FIELDS = exports.NODE_FIELDS || (exports.NODE_FIELDS = {}));
//# sourceMappingURL=VFS.js.map
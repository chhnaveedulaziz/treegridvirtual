const fs = require('fs');

module.exports.jsonReader = function jsonReader(filePath, cb) {

    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }

        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    });

}

module.exports.findParents = function findParents(taskID) {

    let parent = ''
    let parentArr = []

    for(let el of taskID) {
        if(Number.isInteger(parseInt(el))) {
            parentArr.push(parent)
            parent = ''
            continue
        }
        parent += el
    }

    if(parentArr.length <= 0)
        return parent
    else
        return parentArr

}

module.exports.findChildren = function findChildren(taskID) {

    let children = taskID.match(/(\d+)/g)

    if(children && children.length > 0)
        return children
    else
        return 0

}

module.exports.findObject = function findObject(taskID, data) {

    let parent = this.findParents(taskID)[0]
    let children = this.findChildren(taskID)

    for(let el of data) {
        if(el.taskID === parent) {
            if(children.length > 0) {
                let key = 'el'
                for(let i = 0; i < children.length; i++) {
                    key = key + '.subtasks['+ (children[i] - 1) +']'
                }
                return eval(key)
            }
            return el
        }
    }

}

module.exports.iterateKey = function iterateKey(key) {

    if(key[key.length - 1] === 'Z') {

        if(key.length !== 1) {
            key = key.slice(0, key.length - 1)
            key += 'AA'
        } else {
            key = 'AA'
        }

    } else {

        let temp = String.fromCharCode(key.charCodeAt(key.length - 1) + 1)

        if(key.length !== 1) {
            key = key.slice(0, key.length - 1)
            key += temp
        }
        else{
            key = temp
        }

    }

    return key
}
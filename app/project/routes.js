const express = require('express');
const fs = require("fs");

const utils = require('./utils')

module.exports = function (io) {

    const router = express.Router();

    router.get('/', async (req, res) => {

        utils.jsonReader("./treeGridData.json", (err, data) => {
            if (err) {
                return res.status(400).send(err.message);
            }

            return res.json(data)
        });

    });

    router.get('/:taskID', async (req, res) => {

        utils.jsonReader("./treeGridData.json", (err, data) => {

            if (err) {
                return res.status(400).send(err.message);
            }

            return res.json(utils.findObject(req.params.taskID, data.data))

        });

    });

    router.post('/add-child/:taskID', (req, res) => {

        let { taskName, startDate, endDate, progress, duration, priority, approved } = req.body

        utils.jsonReader("./treeGridData.json", (err, data) => {

            if (err) {
                return res.status(400).send(err.message);
            }

            let jsonData = data

            let parents = utils.findParents(req.params.taskID)
            let children = utils.findChildren(req.params.taskID)

            for(let el of jsonData.data) {
                if(el.taskID === parents[0]) {

                    if(children.length > 0) {

                        let key = 'el'
                        for(let i = 0; i < children.length; i++) {
                            key = key + '.subtasks['+ (children[i] - 1) +']'
                        }

                        if(eval(key).subtasks) {

                            let temp = utils.findParents(eval(key).subtasks[0].taskID)

                            eval(key).subtasks.push({
                                taskID: eval(key).taskID + temp[temp.length - 1] + (eval(key).subtasks.length + 1),
                                taskName,
                                startDate,
                                endDate,
                                progress,
                                duration,
                                priority,
                                approved
                            })

                        } else {

                            eval(key).subtasks = [{
                                taskID: eval(key).taskID + 'A' + '1',
                                taskName,
                                startDate,
                                endDate,
                                progress,
                                duration,
                                priority,
                                approved
                            }]

                        }

                    }

                    if(el.subtasks) {

                        let key = el.taskID + (el.subtasks.length + 1)
                        el.subtasks.push({
                            taskID: key,
                            taskName,
                            startDate,
                            endDate,
                            progress,
                            duration,
                            priority,
                            approved
                        })

                    } else {

                        el.subtasks = [{
                            taskID: el.taskID + 1,
                            taskName,
                            startDate,
                            endDate,
                            progress,
                            duration,
                            priority,
                            approved
                        }]

                    }
                }
            }

            let fileData = JSON.stringify(jsonData)

            fs.writeFile('./treeGridData.json', fileData, 'utf8', err => {
                if(err) {
                    return res.status(400).send(err.message)
                }

                io.sockets.emit('addChild', JSON.parse(fileData));

                return res.json(JSON.parse(fileData))
            });

        });

    });

    router.post("/add-row", (req, res) => {

        let { taskName, startDate, endDate, progress, duration, priority, approved } = req.body

        utils.jsonReader("./treeGridData.json", (err, data) => {

            if (err) {
                return res.status(400).send(err.message);
            }

            let jsonData = data

            let lastID = null

            for(let el of jsonData.data)
                lastID = el.taskID

            let nextID = utils.iterateKey(lastID)

            jsonData.data.push({
                taskID: nextID,
                taskName,
                startDate,
                endDate,
                progress,
                duration,
                priority,
                approved
            })

            let fileData = JSON.stringify(jsonData)

            fs.writeFile('./treeGridData.json', fileData, 'utf8', err => {
                if(err) {
                    return res.status(400).send(err.message)
                }

                io.sockets.emit('addRow', JSON.parse(fileData));

                return res.json(JSON.parse(fileData))
            });

        });

    });

    router.post('/edit-row/:taskID', (req, res) => {

        let { taskName, startDate, endDate, progress, duration, priority, approved } = req.body

        utils.jsonReader("./treeGridData.json", (err, data) => {

            if (err) {
                return res.status(400).send(err.message);
            }

            let jsonData = data

            let parents = utils.findParents(req.params.taskID)
            let children = utils.findChildren(req.params.taskID)

            for(let el of jsonData.data) {
                if(el.taskID === parents[0]) {

                    if(children.length > 0) {

                        let key = 'el'
                        for(let i = 0; i < children.length; i++) {
                            key = key + '.subtasks['+ (children[i] - 1) +']'
                        }

                        eval(key).taskName = taskName
                        eval(key).startDate = startDate
                        eval(key).endDate = endDate
                        eval(key).progress = progress
                        eval(key).duration = duration
                        eval(key).priority = priority
                        eval(key).approved = approved

                    }

                    el.taskName = taskName
                    el.startDate = startDate
                    el.endDate = endDate
                    el.progress = progress
                    el.duration = duration
                    el.priority = priority
                    el.approved = approved

                }
            }

            let fileData = JSON.stringify(jsonData)

            fs.writeFile('./treeGridData.json', fileData, 'utf8', err => {
                if(err) {
                    return res.status(400).send(err.message)
                }

                io.sockets.emit('editRow', JSON.parse(fileData));

                return res.json(JSON.parse(fileData))
            });

        });

    });

    router.post('/delete-row/:taskID', (req, res) => {

        utils.jsonReader("./treeGridData.json", (err, data) => {

            if (err) {
                return res.status(400).send(err.message);
            }

            let jsonData = data

            let parents = utils.findParents(req.params.taskID)
            let children = utils.findChildren(req.params.taskID)

            for(let index in jsonData.data) {

                if(jsonData.data[index].taskID === parents[0]) {

                    if(children.length > 0) {

                        let key = 'jsonData.data['+ index +']'
                        for(let i = 0; i < children.length - 1; i++) {
                            key = key + '.subtasks['+ (children[i] - 1) +']'
                        }

                        eval(key).subtasks.splice(children[children.length - 1] - 1, 1)
                        break

                    }

                    jsonData.data.splice(index, 1)

                }
            }

            let fileData = JSON.stringify(jsonData)

            fs.writeFile('./treeGridData.json', fileData, 'utf8', err => {
                if(err) {
                    return res.status(400).send(err.message)
                }

                io.sockets.emit('deleteRow', JSON.parse(fileData));

                return res.json(JSON.parse(fileData))
            });

        });

    });

    router.post('/update-columns', (req, res) => {

        utils.jsonReader("./treeGridData.json", (err, data) => {

            if (err) {
                return res.status(400).send(err.message);
            }

            let jsonData = data

            jsonData.columns = req.body

            let fileData = JSON.stringify(jsonData)

            fs.writeFile('./treeGridData.json', fileData, 'utf8', err => {
                if(err) {
                    return res.status(400).send(err.message)
                }

                io.sockets.emit('updateColumns', JSON.parse(fileData));

                return res.json(JSON.parse(fileData))
            });

        });

    });

    return router;

}

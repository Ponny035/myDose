const { activityInformation } = require('../services/database')
const { PythonShell } = require('python-shell')

const express = require('express'),
    router = express.Router()

router.post('/information', async (req, res) => {
    let { activityId } = req.body

    let information = await activityInformation.getActivitiesRecommendation(
        activityId
    )

    res.send(information)
})

router.post('/recommendation', async (req, res) => {
    const userId = req.body.userId
    const skillId = req.body.skillId
    if (!userId) return res.status(403).send('Unanthorized')

    const pythonShellOptions = {
        args: [userId, skillId],
        scriptPath: 'Recommendation System/Cluster'
    }
    console.log("check")
    PythonShell.run(
        'recommender.py',
        pythonShellOptions,
        async (err, results) => {
            if (err) throw err
            const activities = await activityInformation.getActivitiesRecommendation(
                results
            )
            res.send(activities)
        }
    )
    console.log("check2")
})

module.exports = router

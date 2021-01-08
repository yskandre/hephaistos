const fs = require('fs')
const path = require('path')

data = JSON.parse(fs.readFileSync(path.join('assets', 'userdata.json')))

document.getElementById('userimg').src = path.join(...data.image)
document.getElementById('username').innerHTML = data.name
document.getElementById('title').innerHTML = data.title
document.getElementById('xp').innerHTML = data.xp + 'XP gesammelt'

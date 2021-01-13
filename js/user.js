const fs = require('fs')
const path = require('path')
const $ = require('jquery')
const _ = require('underscore')

data = JSON.parse(fs.readFileSync(path.join('assets', 'userdata.json')))

$('#user-img').attr('src', path.join(...data.image))
$('#user-name').html(data.name)
$('#title').html(data.title)
$('#xp').html(data.xp + 'XP gesammelt')

const fs = require('fs')
const path = require('path')
const $ = require('jquery')
const _ = require('underscore')

data = JSON.parse(fs.readFileSync(path.join('assets', 'userdata.json')))
xp = data.xp
title = data.title

$('#user-img').attr('src', path.join(...data.image))
$('#user-name').html(data.name)
updateUser()

function updateUser() {
  $('#title').html(title)
  $('#xp').html(xp + 'XP gesammelt')
}

userData = JSON.parse(fs.readFileSync(path.join('assets', 'userdata.json')))

$('#user-img').attr('src', path.join(...userData.image))
$('#user-name').html(userData.name)
updateUser()

function updateUser() {
  $('#title').html(userData.title)
  $('#xp').html(userData.xp + 'XP gesammelt')
}

function saveUserData() {
  //fs.writeFileSync(path.join('assets', 'userdata.json'), JSON.stringify(userData))
}

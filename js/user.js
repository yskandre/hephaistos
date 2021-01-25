userData = JSON.parse(fs.readFileSync(path.join('assets', 'userdata.json')))

updateUser()
updateStreak()

function updateUser() {
  $('#user-img').attr('src', path.join(...userData.image))
  $('#user-name').html(userData.name)
  $('#title').html(_.sample(userData.titles))
  $('#xp').html(userData.xp + 'XP gesammelt')
}

function updateStreak() {
  lastLogin = new Date(userData.login.year, userData.login.month, userData.login.day, 0, 0, 0, 0)
  today = new Date()
  today.setHours(0, 0, 0, 0)

  if (today - lastLogin === 24 * 60 * 60 * 1000) {
    userData.streak += 1
  } else if (today - lastLogin != 0) {
    userData.streak = 1
  }

  if (userData.streak === 5) {
    unlockAchievement('Login-Streak Level 1')
  }

  if (userData.streak === 15) {
    unlockAchievement('Login-Streak Level 2')
  }

  if (userData.streak === 30) {
    unlockAchievement('Login-Streak Level 3')
  }

  if (userData.streak === 50) {
    unlockAchievement('Login-Streak Level 4')
  }

  if (userData.streak === 75) {
    unlockAchievement('Login-Streak Level 5')
  }

  userData.login = {
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
  }
  $('#streak').text(userData.streak + ' Tage in Folge eingeloggt')
}

function unlockTitle(title) {
  if (!_.contains(userData.titles, title)) {
    userData.titles.push(title)

    modal = $('<div class="achievement-modal"></div>')
    modal.append(
      $(`<span class="modal-title">Du hast einen neuen Titel freigeschaltet!<br></span>`)
    )

    table = $('<table></table>')
    row = $('<tr></tr>')
    cellImage = $(`<td class="user-elements"></td>`)
    cellImage.append(
      `<img class="achievement-icon" src="${path.join(
        ...userData.image
      )}" alt="ai" width="100" height="100"/>`
    )
    cellImage.appendTo(row)
    cellDesc = $(`<td class="user-elements"></td>`)
    cellDesc.append(`<span class="achievement-name">${title.name}</span>`)
    cellDesc.append('<br>')
    cellDesc.append(`<span class="achievement-desc">${title.desc}</span>`)
    cellDesc.appendTo(row)
    cellNext = $(`<td class="user-elements"></td>`)
    next = $(`<button>Super</button>`)
    next.on('click', function () {
      if (modals.length === 1) backdrop.remove()
      modals.pop().remove()
    })
    next.appendTo(cellNext)
    cellNext.appendTo(row)
    row.appendTo(table)
    table.appendTo(modal)

    modal.appendTo('#main')
    if (modals.length === 0) {
      backdrop = $('<div class="modal-backdrop"></div>')
      backdrop.appendTo('#main')
    }

    modals.push(modal)
  }
}

function saveUserData() {
  //fs.writeFileSync(path.join('assets', 'userdata.json'), JSON.stringify(userData))
}

achievementData = JSON.parse(fs.readFileSync(path.join('assets', 'achievements.json')))

modals = []

unlockAchievement('Hello World')
updateAchievements()

function updateAchievements() {
  $('#achievements').empty()
  table = $('<table></table>')

  Object.entries(achievementData).forEach((entry) => {
    a = entry[1]

    row = $('<tr></tr>')
    cellImage = $(`<td class="user-elements"></td>`)
    cellImage.append(
      `<img style="-webkit-filter: grayscale(${
        a.earned ? '0' : '1'
      });" class="achievement-icon" src="${path.join(...a.icon)}" alt="ai" width="65" height="65"/>`
    )
    cellImage.appendTo(row)
    cellDesc = $(`<td class="user-elements"></td>`)
    cellDesc.append(`<span class="achievement-name">${entry[0]}</span>`)
    if (a.earned) {
      cellDesc.append(`<span class="achievement-desc">Erhalten (${a.date})</span>`)
    } else {
      cellDesc.append(`<span class="achievement-desc">Noch nicht erhalten</span>`)
    }
    cellDesc.append('<br>')
    cellDesc.append(`<span class="achievement-desc">${a.desc}</span>`)
    cellDesc.appendTo(row)
    row.appendTo(table)
  })

  $('#achievements').append(table)
}

function unlockAchievement(name) {
  if (!achievementData[name].earned) {
    achievementData[name].earned = true
    achievementData[name].date = Intl.DateTimeFormat('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date())

    modal = $('<div class="achievement-modal modal"></div>')
    modal.append(
      $(`<div class="modal-title">Du hast ein neues Achievement freigeschaltet!<br></div>`)
    )

    table = $('<table class="modal-table"></table>')
    table.append(
      '<colgroup><col style="width:25%;"><col style="width:50%;"><col style="width:25%;"></colgroup>'
    )
    row = $('<tr></tr>')
    cellImage = $(`<td class="user-elements"></td>`)
    cellImage.append(
      `<img class="achievement-icon" src="${path.join(
        ...achievementData[name].icon
      )}" alt="ai" width="100" height="100"/>`
    )
    cellImage.appendTo(row)
    cellDesc = $(`<td class="user-elements"></td>`)
    cellDesc.append(`<span class="achievement-name">${name}</span>`)
    cellDesc.append('<br>')
    cellDesc.append(`<span class="achievement-desc">${achievementData[name].desc}</span>`)
    cellDesc.appendTo(row)
    cellNext = $(`<td class="user-elements right-align"></td>`)
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

    updateAchievements()
  }
}

function saveAchievements() {
  //fs.writeFileSync(path.join('assets', 'achievements.json'), JSON.stringify(achievementData))
}

achievementData = JSON.parse(fs.readFileSync(path.join('assets', 'achievements.json')))

updateAchievements()

function updateAchievements() {
  table = $('<table></table>')

  achievementData.forEach((a) => {
    row = $('<tr></tr>')
    cellImage = $(`<td class="user-elements"></td>`)
    cellImage.append(
      `<img style="-webkit-filter: grayscale(${
        a.earned ? '0' : '1'
      });" class="achievement-icon" src="${path.join(...a.icon)}" alt="ai" width="65" height="65"/>`
    )
    cellImage.appendTo(row)
    cellDesc = $(`<td class="user-elements"></td>`)
    cellDesc.append(`<span class="achievement-name">${a.name}</span>`)
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

function saveAchievements() {
  //fs.writeFileSync(path.join('assets', 'achievements.json'), JSON.stringify(achievementData))
}

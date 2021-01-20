achievementData = JSON.parse(fs.readFileSync(path.join('assets', 'achievements.json')))

achievements = document.getElementById('achievements')

achievementData.forEach((a) => {
  temp = document.createElement('div')
  temp.innerHTML = `
    <table>
        <tr>
            <td>
                <img style="-webkit-filter: grayscale(${
                  a.earned ? '0' : '1'
                });" class="achievementicon" src="${path.join(
    ...a.icon
  )}" alt="ai width="50" height="50"/>
            </td>
            <td>
                <span class="achievementname">${a.name}</span>
                <br />
                ${a.earned ? '<span>Earned</span><br />' : ''}
                <span class="achievementdesc">${a.desc}</span>
            </td>
        </tr>
    </table>`
  achievements.appendChild(temp)
})

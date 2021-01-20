courseData = JSON.parse(fs.readFileSync(path.join('assets', 'lessons.json')))

courseData.forEach((s) => {
  segment = $('<div/>')
  header = $(`<span>${s.name}</span><br/>`)
  segment.append(header)
  s.lessons.forEach((lesson) => {
    button = $(`<button class='lesson-button'>${lesson.name}</button>`)
    button.on('click', (e) => {
      if ($(e.target).hasClass('selected')) {
        $(e.target).removeClass('selected')
        loadLesson(lesson.questions)
        $('#lesson-info').text('poopie')
      } else {
        $('.lesson-button').removeClass('selected')
        $(e.target).addClass('selected')
        $('#lesson-info').text(lesson.writeup)
      }
    })
    button.appendTo(segment)
    segment.append($('<br/>'))
  })
  $('#lesson-tab').append(segment)
})

function loadLesson(questions) {
  let newXP = 0
  modal = $('<div>Gaming</div>')
  winPanel = $('<div>Ergebnisse:</div>')
  showScoreButton = $('<button>Anzeigen</button>')
  showScoreButton.on('click', function () {
    userData.xp += newXP
    updateUser()
    winPanel.append($(`<div>+${newXP}XP!<br>Du hast jetzt insgesamt ${userData.xp}XP!</div>`))
    next = $(`<button>Super</button>`)
    next.on('click', function () {
      modal.remove()
    })
    next.appendTo($(this).parent())
    $(this).toggle()
  })
  showScoreButton.appendTo(winPanel)
  winPanel.hide()
  winPanel.appendTo(modal)
  //Create Modal
  _.sample(questions, Math.min(questions.length, 5)).forEach(function (q) {
    question = $(`<div class="question">${q.question}<br></div>`)
    switch (q.type) {
      case 'match':
        let match = ['', '']
        let matchButtons = [null, null]
        left = _.shuffle(q.options[0])
        right = _.shuffle(q.options[1])
        for (let i = 0; i < Math.min(left.length, right.length); i++) {
          buttonLeft = $(`<button class="match-left">${left[i]}</button>`)
          buttonLeft.on('click', function () {
            if ($(this).hasClass('matched')) {
              //animation
              return
            }
            if ($(this).hasClass('selected')) {
              $(this).removeClass('selected')
              match = ['', '']
              matchButtons = [null, null]
              return
            }
            $('.match-left').removeClass('selected')
            $(this).addClass('selected')
            match[0] = $(this).text()
            matchButtons[0] = $(this)
            if (match.every((v) => v != '')) {
              if (q.solutions.some((s) => _.isEqual(s, match))) {
                newXP += 2
                //indicator
                matchButtons.forEach((e) => {
                  e.addClass('matched')
                  e.removeClass('selected')
                })
                match = ['', '']
                matchButtons = [null, null]
                if (!$(this).parent().children('button').not('.matched').length) {
                  next = $(`<button>Weiter</button>`)
                  next.on('click', function () {
                    $(this).parent().prev().toggle()
                    $(this).parent().toggle()
                  })
                  next.appendTo($(this).parent())
                }
              } else {
                matchButtons.forEach((e) => {
                  e.removeClass('selected')
                })
                match = ['', '']
                matchButtons = [null, null]
              }
            }
            console.log(match)
          })
          buttonRight = $(`<button class="match-right">${right[i]}</button>`)
          buttonRight.on('click', function () {
            if ($(this).hasClass('matched')) {
              //animation
              return
            }
            if ($(this).hasClass('selected')) {
              $(this).removeClass('selected')
              match = ['', '']
              matchButtons = [null, null]
              return
            }
            $('.match-right').removeClass('selected')
            $(this).addClass('selected')
            match[1] = $(this).text()
            matchButtons[1] = $(this)
            if (match.every((v) => v != '')) {
              if (q.solutions.some((s) => _.isEqual(s, match))) {
                newXP += 2
                //indicator
                matchButtons.forEach((e) => {
                  e.addClass('matched')
                  e.removeClass('selected')
                })
                match = ['', '']
                matchButtons = [null, null]
                if (!$(this).parent().children('button').not('.matched').length) {
                  next = $(`<button>Weiter</button>`)
                  next.on('click', function () {
                    $(this).parent().prev().toggle()
                    $(this).parent().toggle()
                  })
                  next.appendTo($(this).parent())
                }
              } else {
                matchButtons.forEach((e) => {
                  e.removeClass('selected')
                })
                match = ['', '']
                matchButtons = [null, null]
              }
            }
            console.log(match)
          })
          buttonLeft.appendTo(question)
          buttonRight.appendTo(question)
          $('<br>').appendTo(question)
        }
        break
      case 'build':
        let build = []
        options = _.shuffle(q.options)
        options.forEach((e) => {
          button = $(`<button>${e}</button>`)
          button.on('click', function () {
            if (build.some((v) => v === e)) {
              build = build.filter((v) => v != e)
            } else {
              build.push(e)
            }
            console.log(build)
            //show current selection
          })
          button.appendTo(question)
          $('<br>').appendTo(question)
        })
        submit = $(`<button>Abgeben!</button>`)
        submit.on('click', function () {
          if (q.solutions.some((s) => _.isEqual(s, build))) {
            newXP += 5
            //indicator
          }

          next = $(`<button>Weiter</button>`)
          next.on('click', function () {
            $(this).parent().prev().toggle()
            $(this).parent().toggle()
          })
          next.appendTo($(this).parent())
          $(this).toggle()
        })
        submit.appendTo(question)
        break
      case 'choice':
        let choice = ''
        options = _.shuffle(q.options)
        options.forEach((e) => {
          button = $(`<button>${e}</button>`)
          button.on('click', () => {
            choice = e
          })
          button.appendTo(question)
          $('<br>').appendTo(question)
        })
        submit = $(`<button>Abgeben!</button>`)
        submit.on('click', function () {
          if (_.contains(q.solutions, choice)) {
            newXP += 5
            //indicator
          }

          next = $(`<button>Weiter</button>`)
          next.on('click', function () {
            $(this).parent().prev().toggle()
            $(this).parent().toggle()
          })
          next.appendTo($(this).parent())
          $(this).toggle()
        })
        submit.appendTo(question)
        break
    }
    question.appendTo(modal)
    question.toggle()
  })
  modal.children().last('.question').toggle()
  modal.appendTo('#lesson-tab')
}

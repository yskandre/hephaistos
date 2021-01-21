courseData = JSON.parse(fs.readFileSync(path.join('assets', 'lessons.json')))

loadCourses()

function loadCourses() {
  $('#lesson-tab').empty()
  $('#lesson-tab').text('Lessons')
  courseData.forEach((s) => {
    masteredLessons = 0
    totalLessons = 0
    segment = $('<div class="course-segment"/>')
    header = $(`<div class="course-title">${s.name}<hr class="course-seperator"></div>`)
    segment.append(header)
    s.lessons.forEach((lesson) => {
      clearedQuestions = Object.values(lesson.questions).filter((q) => q.cleared).length
      totalQuestions = Object.values(lesson.questions).length
      if (clearedQuestions === totalQuestions && totalQuestions !== 0) {
        masteredLessons += 1
      }
      totalLessons += 1
      button = $(
        `<button class='lesson-button'>${lesson.name}<br>${clearedQuestions}/${totalQuestions} geschafft</button>`
      )
      button.on('click', (e) => {
        if ($(e.target).hasClass('selected')) {
          $(e.target).removeClass('selected')
          loadLesson(lesson.questions)
          $('#lesson-info').text('')
        } else {
          $('.lesson-button').removeClass('selected')
          $(e.target).addClass('selected')
          $('#lesson-info').text(lesson.writeup)
        }
      })
      button.appendTo(segment)
    })
    footer = $(
      `<div class="course-title">${masteredLessons}/${totalLessons} gemeistert<hr class="course-endmark"></div>`
    )
    //display mastery progress for segment, reload after each clear
    segment.append(footer)
    $('#lesson-tab').append(segment)
  })
}

function loadLesson(questions) {
  let newXP = 0
  modal = $('<div class="course-modal">Gaming</div>')
  winPanel = $('<div>Ergebnisse:</div>')
  showScoreButton = $('<button>Anzeigen</button>')
  showScoreButton.on('click', function () {
    userData.xp += newXP
    updateUser()
    winPanel.append($(`<div>+${newXP}XP!<br>Du hast jetzt insgesamt ${userData.xp}XP!</div>`))
    next = $(`<button>Super</button>`)
    next.on('click', function () {
      loadCourses()
      modal.remove()
    })
    next.appendTo($(this).parent())
    $(this).toggle()
  })
  showScoreButton.appendTo(winPanel)
  winPanel.hide()
  winPanel.appendTo(modal)
  //Create Modal
  console.log(Object.values(questions))
  _.sample(Object.values(questions), Math.min(Object.values(questions).length, 5)).forEach(
    function (q) {
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
                console.log(q)
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
                    clearQuestion(q)
                    //disable other buttons
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
                    clearQuestion(q)
                    //disable other buttons
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
              clearQuestion(q)
              //indicator
            }

            //disable other buttons
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
              clearQuestion(q)
              //indicator
            }
            //disable other buttons
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
    }
  )
  modal.children().last('.question').toggle()
  modal.appendTo('#main')

  function clearQuestion(q) {
    k = Object.keys(questions).find((key) => questions[key] === q)
    console.log(q, 'LOL', k)
    if (!questions[k].cleared) {
      questions[k].cleared = true
    }
    //if lesson not yet cleared, set flag and increment counters etc
    //else return
  }
}

function saveCourseData() {
  //fs.writeFileSync(path.join('assets', 'lessons.json'), JSON.stringify(courseData))
}

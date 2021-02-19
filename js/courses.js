courseData = JSON.parse(fs.readFileSync(path.join('assets', 'lessons.json')))

loadCourses()

function loadCourses() {
  $('#lesson-tab').empty()
  courseData.forEach((s) => {
    masteredLessons = 0
    totalLessons = 0
    segment = $('<div class="course-segment"/>')
    header = $(`<div class="course-title">${s.name}</div>`)
    segment.append(header)
    s.lessons.forEach((lesson) => {
      clearedQuestions = Object.values(lesson.questions).filter((q) => q.cleared).length
      totalQuestions = Object.values(lesson.questions).length
      button = $(
        totalQuestions !== 0
          ? `<button class="lesson-button">${lesson.name}<br>${clearedQuestions}/${totalQuestions}</button>`
          : `<button class="lesson-button info">${lesson.name}</button>`
      )
      button.on('click', (e) => {
        if ($(e.target).hasClass('selected') && !$(e.target).hasClass('info')) {
          $(e.target).removeClass('selected')
          loadLesson(lesson.questions)
          $('#lesson-info').html('')
        } else {
          $('.lesson-button').removeClass('selected')
          $(e.target).addClass('selected')
          $('#lesson-info').html(lesson.writeup)
        }
      })
      if (totalQuestions !== 0) {
        if (clearedQuestions === totalQuestions) {
          masteredLessons += 1
          button.addClass('mastered')
        }
        totalLessons += 1
      }
      button.appendTo(segment)
    })
    footer = $(
      `<div class="course-title">${masteredLessons}/${totalLessons} gemeistert<hr class="course-endmark"></div>`
    )
    if (masteredLessons === totalLessons) {
      console.log(s)
      unlockTitle(s.clearTitle)
    }
    segment.append(footer)
    $('#lesson-tab').append(segment)
  })
}

function loadLesson(questions) {
  let newXP = 0
  backdrop = $('<div class="modal-backdrop"></div>')
  progress = $('<div id="progress-bar"></div>')
  modal = $('<div class="course-modal modal"></div>')
  winPanel = $('<div class="modal-title">Ergebnisse:<br></div>')
  showScoreButton = $('<button>Anzeigen</button>')
  showScoreButton.on('click', function () {
    userData.xp += newXP
    updateUser()
    winPanel.append($(`<div>+${newXP}XP!<br>Du hast jetzt insgesamt ${userData.xp}XP!</div>`))
    next = $(`<button>Super</button>`)
    next.on('click', function () {
      progress.remove()
      backdrop.remove()
      modals.pop().remove()
      unlockAchievement('Ein kleiner Schritt...')
      loadCourses()
    })
    next.appendTo($(this).parent())
    $(this).toggle()
  })
  showScoreButton.appendTo(winPanel)
  winPanel.hide()
  winPanel.appendTo(modal)

  console.log(Object.values(questions))
  _.sample(Object.values(questions), Math.min(Object.values(questions).length, 5)).forEach(
    function (q) {
      progress.append('<div class="progress-point progress-todo"></div>')
      question = $(`<div class="question"></div>`)
      question.append(`<div class=modal-title>${q.question}</div><br>`)
      switch (q.type) {
        case 'match':
          let match = ['', '']
          let matchButtons = [null, null]
          left = _.shuffle(q.options[0])
          right = _.shuffle(q.options[1])
          for (let i = 0; i < Math.min(left.length, right.length); i++) {
            buttonLeft = $(`<button class="task-button match-left">${left[i]}</button>`)
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
                    e.addClass('matched disabled')
                    e.removeClass('selected')
                    e.prop('disabled', true)
                  })
                  match = ['', '']
                  matchButtons = [null, null]
                  if (!$(this).parent().children('.task-button').not('.matched').length) {
                    clearQuestion(q)
                    advanceProgress(true)

                    next = $(`<button class="task-menu-button">Weiter</button>`)
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
            buttonRight = $(`<button class="task-button match-right">${right[i]}</button>`)
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
                    e.addClass('matched disabled')
                    e.removeClass('selected')
                    e.prop('disabled', true)
                  })
                  match = ['', '']
                  matchButtons = [null, null]
                  if (!$(this).parent().children('.task-button').not('.matched').length) {
                    clearQuestion(q)
                    advanceProgress(true)

                    next = $(`<button class="task-menu-button">Weiter</button>`)
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
          correctButtons = []
          selectedButtons = []
          let build = []
          combination = $('<span class="build-combination"></span>')
          options = _.shuffle(q.options)
          options.forEach((e) => {
            button = $(`<button class="task-button">${e}</button>`)
            if (q.solutions.some((s) => _.contains(s, e))) {
              correctButtons.push(button)
            }
            button.on('click', function () {
              if (build.some((v) => v === e)) {
                build = build.filter((v) => v != e)
                selectedButtons = selectedButtons.filter((v) => v !== $(this))
              } else {
                build.push(e)
                selectedButtons.push($(this))
              }
              $(this).toggleClass('selected')
              combination.text(build.join(' '))
            })
            button.appendTo(question)
          })
          submit = $(`<button class="task-menu-button">Abgeben</button>`)
          submit.on('click', function () {
            if (q.solutions.some((s) => _.isEqual(s, build))) {
              newXP += 5
              clearQuestion(q)
              advanceProgress(true)
              correctButtons.forEach((b) => b.addClass('matched'))
            } else {
              advanceProgress(false)
              selectedButtons.forEach((b) => b.addClass('failed'))
              correctButtons.forEach((b) => b.addClass('matched'))
            }
            $(this).parent().children('.task-button').addClass('disabled')
            $(this).parent().children('.task-button').prop('disabled', true)

            next = $(`<button class="task-menu-button">Weiter</button>`)
            next.on('click', function () {
              $(this).parent().prev().toggle()
              $(this).parent().toggle()
            })
            next.appendTo($(this).parent())
            $(this).toggle()
          })
          question.append('<br>')
          combination.appendTo(question)
          question.append('<br>')
          submit.appendTo(question)
          break
        case 'choice':
          correctChoices = []
          selectedChoice = null
          let choice = ''
          options = _.shuffle(q.options)
          options.forEach((e) => {
            button = $(`<button class="task-button">${e}</button>`)
            if (_.contains(q.solutions, e)) {
              correctChoices.push(button)
            }
            button.on('click', function () {
              choice = e
              selectedChoice = $(this)
              $(this).parent().children('.task-button').removeClass('selected')
              $(this).addClass('selected')
            })
            button.appendTo(question)
            question.append('<br>')
          })
          submit = $(`<button class="task-menu-button">Abgeben</button>`)
          submit.on('click', function () {
            if (_.contains(q.solutions, choice)) {
              newXP += 5
              clearQuestion(q)
              advanceProgress(true)
              selectedChoice.addClass('matched')
            } else {
              advanceProgress(false)
              if (selectedChoice) selectedChoice.addClass('failed')
              correctChoices.forEach((b) => b.addClass('matched'))
            }

            $(this).parent().children('.task-button').addClass('disabled')
            $(this).parent().children('.task-button').prop('disabled', true)

            next = $(`<button class="task-menu-button">Weiter</button>`)
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
  progress.appendTo('#main')
  backdrop.appendTo('#main')

  modals.push(modal)

  function clearQuestion(q) {
    k = Object.keys(questions).find((key) => questions[key] === q)
    if (!questions[k].cleared) {
      questions[k].cleared = true
    }
    //if lesson not yet cleared, set flag and increment counters etc
    //else return
  }

  function advanceProgress(passed) {
    progressPoint = $('#progress-bar').children('.progress-todo').first()
    progressPoint.removeClass('progress-todo')
    progressPoint.addClass(passed ? 'progress-passed' : 'progress-failed')
  }
}

function saveCourseData() {
  fs.writeFileSync(path.join('assets', 'lessons.json'), JSON.stringify(courseData))
}

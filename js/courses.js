data = JSON.parse(fs.readFileSync(path.join('assets', 'lessons.json')))

data.forEach((s) => {
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
        console.log(lesson.name + '_2')
      } else {
        $('.lesson-button').removeClass('selected')
        $(e.target).addClass('selected')
        $('#lesson-info').text(lesson.writeup)
        console.log(lesson.name + '_1')
      }
    })
    button.appendTo(segment)
    segment.append($('<br/>'))
  })
  $('#lesson-tab').append(segment)
})

function loadLesson(questions) {
  console.log('existing')
  modal = $(`<div>Gaming</div>`)
  //add win div
  //Create Modal
  let match = []
  let build = []
  let choice = ''
  _.sample(questions, Math.min(questions.length, 5)).forEach(function (q) {
    question = $(`<div class="question">${q.question}<br></div>`)
    switch (q.type) {
      case 'match':
        left = _.shuffle(q.options[0])
        right = _.shuffle(q.options[1])
        for (let i = 0; i < Math.min(left.length, right.length); i++) {
          buttonLeft = $(`<button>${left[i]}</button>`)

          buttonRight = $(`<button>${right[i]}</button>`)
          //mark pressed buttons, unmark by clicking again
          //if 2 buttons are pressed, if combination is in q.solutions, +XP
          //if correct, disable the buttons, if wrong just unmark them
          //if all buttons are disabled, create button to go next
          buttonLeft.appendTo(question)
          buttonRight.appendTo(question)
          $('<br>').appendTo(question)
        }
        /*
        submit = $(`<button>Abgeben!</button>`)
        submit.on('click', () => {
          q.solutions.every((s) => {
            if (_.isEqual(s, build)) {
              xp += 5
              //indicator
              return false
            }
            return true
          })

          if (i < modal.children().toArray().length - 1) {
            next = $(`<button>Nächste Aufgabe</button>`)
          } else {
            next = $(`<button>Beenden</button>`)
          }
          next.on('click', () => {
            modal.children().each((idx, e) => {
              if (idx === i) {
                e.show()
              } else {
                e.hide()
              }
            })
          })
          next.appendTo(question)
          $(this).hide()
        })
        submit.appendTo(question)
        */
        break
      case 'build':
        options = _.shuffle(q.options)
        options.forEach((e) => {
          button = $(`<button>${e}</button>`)
          //onclick add to build array or remove again ORDER AUTOMATICALLY
          button.appendTo(question)
          $('<br>').appendTo(question)
        })
        submit = $(`<button>Abgeben!</button>`)
        submit.on('click', function () {
          q.solutions.every((s) => {
            if (_.isEqual(s, build)) {
              xp += 5
              //indicator
              return false
            }
            return true
          })

          next = $(`<button>Super</button>`)
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
            xp += 5
            console.log(xp)
            //indicator
          }

          next = $(`<button>Super</button>`)
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

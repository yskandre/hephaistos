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
  //Create Modal
  _.sample(questions, Math.min(questions.length / 2, 5)).forEach((q) => {
    switch (q.type) {
      //Create Question and append to modal as a tab
      case 'match':
        //TODO
        break
      case 'single choice':
        //TODO
        break
      case 'translate':
        //TODO
        break
    }
  })
}

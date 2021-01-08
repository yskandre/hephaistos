data = JSON.parse(fs.readFileSync(path.join('assets', 'lessons.json')))

lessons = document.getElementById('lessontab')
details = document.getElementById('detailtab')
console.log(data)

data.forEach((s) => {
  segment = document.createElement('div')
  header = document.createElement('span')
  header.innerHTML = s.name
  segment.appendChild(header)
  console.log(s.lessons)
  s.lessons.forEach((l) => {
    lesson = document.createElement('button')
    lesson.className += 'lessonbutton'
    lesson.innerHTML = l.name
    lesson.addEventListener('click', function () {
      details.innerHTML = l.writeup
    })
    segment.appendChild(document.createElement('br'))
    segment.appendChild(lesson)
  })
  lessons.appendChild(segment)
})

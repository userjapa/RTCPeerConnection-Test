export default data => {
  delete answerers[data.io]
  delete answers[data.id]
  delete offerers[data.id]
  delete offers[data.id]
  const screen = document.getElementById('screen')
  const user = document.getElementById(data.id)
  // Removing User
  screen.removeChild(user)
}

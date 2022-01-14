const { app } = require('./src/configuracion')
const PORT = 4000

// Servidor
app.listen(PORT, async() => {
  console.log(`Servidor funcionando en el puerto ${PORT}`)
})

const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

exports.schedule = functions.https.onRequest(async (req, res) => {
  const text = req.query.text
  console.log('text', text)
  if (text) {
    db.collection('test').doc(text).set({
      text,
      now: Date.now()
    })
  }
  res.status(200).send('thank you')
})

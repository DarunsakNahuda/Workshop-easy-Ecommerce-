const { initializeApp,applicationDefault } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getAuth } = require('firebase-admin/auth')

const {getDatabase} = require('firebase-admin/database')

initializeApp({
    credential: applicationDefault(), //ใช้ applicationDefault() เพื่อใช้ credentials ที่กำหนดใน environment
    projectId:'', //projectId ของ firebase project
    databaseURL:''//url real-time database emulator
})

const db = getFirestore()
const auth = getAuth()
const realtimeDB = getDatabase()
module.exports ={
    db,
    auth,
    realtimeDB
}

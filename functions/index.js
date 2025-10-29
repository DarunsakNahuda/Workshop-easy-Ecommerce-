const {onRequest} = require("firebase-functions/v2/https")
const express = require('express')
const app = express()

const {initializeApp} = require('firebase-admin/app')
const { db,auth,realtimeDB } = require('./firebaseConfig.js')
const {onDocumentWritten} = require('firebase-functions/v2/firestore')

const  omise = require('omise')({
  secretKey: process.env.OMISE_SECRET_KEY,
  omiseVersion: '2019-05-29'
})

const createCharge = (source, amount, orderId) => {
  return new Promise((resolve, reject) => {
    omise.charges.create({
      amount: (amount * 100),
      currency: 'THB',
      return_uri: `http://localhost:5173/Success?order_id=${orderId}`,
      metadata: {
        orderId
      },
      source,
    }, (err, resp) => {
      if (err) {
        return reject(err)
      }
      resolve(resp)
    })
  })
}

app.post('/placeorder',async(req,res)=>{
try{
  const checkoutData = req.body.checkout
  const sourceOmise = req.body.source
  let checkoutProducts=[]
  let totalPrice=0
  let orderData ={}
  let omiseReseponse = {}
  let successOrderId= ''

  const products =  checkoutData.products

 await db.runTransaction(async(t)=>{
     for (const product of products){
    const productRef = db.collection('products').doc(product.productId)
    const productSnapshot = await productRef.get()
    const productData = productSnapshot.data()

    let checkoutProduct = product
    checkoutProduct.name = productData.name
    checkoutProduct.imageUrl = productData.imageUrl
    checkoutProduct.price = productData.price
    checkoutProduct.totalPrice = productData.price * product.quantity
    totalPrice += (productData.price * product.quantity)
    checkoutProducts.push(checkoutProduct)  

    if (productData.remainQuantity - product.quantity < 0){
      throw new Error (`Product ${productData.name}out of stock`)
  }

  t.update(productRef, {
    remainQuantity: productData.remainQuantity - product.quantity
  })
  }

    const orderRef = db.collection('orders')

    const orderId = orderRef.doc().id

    omiseReseponse = await createCharge(sourceOmise,totalPrice,orderId)

   orderData ={
    ...checkoutData,
    chargeId: omiseReseponse.id,
    products: checkoutProducts,
    totalPrice,
    paymentMethod:'rabbit_linepay',
    createdAt: new Date(),
    status:'pending'
  }
  
  t.set(orderRef.doc(orderId),orderData)

 
  
  successOrderId = orderId
})
  
res.json({ 
  message: 'Hello from Firebase',
  redirectUrl: omiseReseponse.authorize_uri
})

}catch(error){
  console.log('error',error)
  res.status(400).json({ 
    message: error.message
  })
}

})

app.post('/webhook', async(req, res) => {
  console.log('webhook',req.body)
try {
  if(req.body.key === 'charge.complete'){
    const webhookData = req.body.data
    
    const orderId = webhookData.metadata.orderId
    const chargeId = webhookData.id
    const stuatusOrder = webhookData.status
  
    const orderRef = db.collection('orders').doc(orderId)
    const orderSnapshot = await orderRef.get()
    const orderData = orderSnapshot.data()
    
    // Wrong order
    if (orderData.chargeId !== chargeId){
      throw new Error('ChargeId not found')
    }
    
    if ( orderData.status === 'pending'){
       await orderRef.update({
        status: stuatusOrder
       })
       if (stuatusOrder !== 'successful') {
        // refund stock
         db.runTransaction(async(t)=>{
          for (const product of orderData.products){
            const productRef = db.collection('products').doc(product.productId)
            const productSnapshot = await productRef.get()
            const productData = productSnapshot.data()
            t.update(productRef, {
              remainQuantity: productData.remainQuantity + product.quantity
            })
          }
         })
       }     
    }
   }
  
} catch (error) {
  console.log('error',error)
}
})

 app.get('/test', async (req, res) => {
  try {
     const userRef =db.collection('users')
     const userSnapshot = await userRef.get()
     const users =  userSnapshot.docs.map(doc => doc.data())
      res.json({users})
  } catch (error) {
    console.error('error', error)
    res.status(400).json({ message: error.message })
  }
})

 app.get('/set-admin', async (req, res) => {
  try {
    const idToken = req.headers.authorization
    const decodedToken = await auth.verifyIdToken(idToken)
    const userUid = decodedToken.uid
    await auth.setCustomUserClaims(userUid, { isAdmin: true })
     res.json({ message: `user uid ${userUid} is now an admin` })
  } catch (error) {
    console.error('error', error)
    res.status(400).json({ message: error.message })
  }
})

exports.api = onRequest(app)

exports.updateOrder= onDocumentWritten('order/{orderId}',async (event) => {
    const oldData = event.data.before.data()
    const newData = event.data.after.data()

    console.log('oldData', oldData)
    console.log('newData', newData)

    const orderStatRef = realtimeDB.ref('stats/order')

    if(
      newData.status === 'successful' &&
      oldData && oldData.status === 'pending'
    ){
      await orderStatRef.transaction((currentValue) => {
        return currentValue + newData.totalPrice
      })

    }
});

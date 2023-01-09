const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
var permission = require("./api-notebookbuilder-firebase-adminsdk-s2r1y-8c423cfb19.json");

admin.initializeApp({
    credential: admin.credential.cert(permission),
    databaseURL: "https://api-notebookbuilder-default-rtdb.firebaseio.com"
});
//https://api-notebookbuilder-default-rtdb.firebaseio.com/
//"https://api-notebookbuilder.firebaseapp.com
const db = admin.firestore();

app.use(cors({ origin: true }));

app.post('/api/catalogo', (req, res) => {
    (async () => {
        try {
          await db.collection('catalogueFrontPage').doc()
              .create({extension: "jpg", imageUrl:"1", new: true, reference: "1", type: "test"});
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
    })();
});

app.get("/api/catalogo", async (req, res) => {
    try{
        
        let query = db.collection("catalogueFrontPage");
        const querySnapshot = await query.get();
        let docs = querySnapshot.docs;
  
        const response = docs.map((doc) => ({
            id: doc.data().id,
            extension: doc.data().extension,
            imageUrl: doc.data().imageUrl,
            new : doc.data().new,
            rerefence: doc.data().reference,
            type: doc.data().type,
            titulo: doc.data().titulo,
        }));
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(salida("500", error));
    }
  })

function salida(codigo, entrada){
    var today = new Date();
    var date = today.getFullYear()+'-'
    +(today.getMonth()+1)+'-'
    +today.getDate()+"|"
    +today.getHours() + ":" 
    + today.getMinutes() + ":" 
    + today.getSeconds();
    
    if(codigo === "200") return {
        mensaje : "Proceso terminado exitosamente",
        folio : date,
        resultado : entrada
    }

    if(codigo === "201") return {
        mensaje : "Elemento creado exitosamente",
        folio : date,
        resultado : entrada
    }

    if(codigo === "500") return {
        mensaje: "Ocurrio un detalle en el servidor",
        folio : date,
        resultado : entrada
    }

    return {
        mensaje: "Ocurrio un detalle en el servidor",
        folio : date,
        resultado : entrada
    }
}


// app.get("/api/catalogue", async (req, res) => {
//     try{
        
//         let query = db.collection("catalogueFrontPage");
//         const querySnapshot = await query.get();
//         let docs = querySnapshot.docs;
  
//         const response = docs.map((doc) => ({
//             id: doc.id,
//             titulo: doc.data().titulo,
//         }));
  
//         return res.status(200).json(salida("200", response));
//     } catch (error) {
//         return res.status(500).json(salida("500", error));
//     }
//   })

exports.app = functions.https.onRequest(app);
// Esta es la configuracion para enlazar la aplicacion con el proyecto de firebase, estos son los datos de enlace.
var firebaseConfig = {
  apiKey: "AIzaSyAjJHfQEHuXdLOBLo_Y65J2vN2LMGdpdzI",
  authDomain: "cafeteria-2af3e.firebaseapp.com",
  databaseURL: "https://cafeteria-2af3e.firebaseio.com/",
  projectId: "cafeteria-2af3e",
  storageBucket: "cafeteria-2af3e.appspot.com",
  messagingSenderId: "866413191282",
  appId: "1:866413191282:web:765839a77a74074b8922eb",
  measurementId: "G-7XMJTLWXGZ"
};
// Required for side-effects
// Aqui inicializamos firebase con el objeto de configurcion que quedo precargdo
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

/* Esto checa si hay un usuario en linea (logeado)
dependiendo de lo en donde este ejecuta diferente funcion
por ejemplo, si no existe un usuario en linea, te manda a la pagina del login, y no te deja salir de ahi
esto para evitar causar un mal funcionamiento de la app

si se encuenta logead, te manda a tu pantalla deinicio.
*/
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if(window.location.pathname == "/logged.html"){
      document.querySelector('#user').innerHTML = user.displayName;
      document.querySelector('#mail').innerHTML = user.email;
      document.querySelector('#mail').href = "mailto:"+user.email;
    }
    if(window.location.pathname == "/comprar.html"){
      leerTabla();
      leerCarrito();
    }
    if(window.location.pathname == "/login.html"){
      window.location.replace("./logged.html")
    }
    if(window.location.pathname != "login.html"){
      document.getElementById('logged').innerHTML = user.displayName;
    }
  } else {

    // No user is signed in.
    if(window.location.pathname == "/login.html"){
    }else{
      window.location.replace("./login.html")
    }
  }
});

if(window.location.pathname == "./logged.html"){
  var botonlogout = document.getElementById('logout');
  botonlogout.addEventListener("click",singOut);
}

// Aqui se acaba el main
// Esta es una función para añadir un objeto al leerCarrito, del menu que ya esta establecido
function addCart(pAdded){
  var pName = "";
  var pPrecio;
  db.collection("comidas").doc(pAdded).get().then(function(doc){
    if(doc.exists){
      pName = doc.data().Nombre;
      pPrecio = doc.data().Precio;
      db.collection("cart").add({
        productId : pAdded,
        productName : pName,
        productPrice : pPrecio,
        userId : firebase.auth().currentUser.uid
      })
      .then(function(docRef) {
          leerCarrito();
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    }else{
      console.log("No existe esa comida ingresada")
    }
  }).catch(function(error){
    console.log("Error obteniendo el documento:", error);
  });
}


// Esta funcion elimina un producto del carrito.
function deleteCart(productId){
  db.collection("cart").doc(productId).delete().then(function() {
    alert('Pedido eliminado del carrito')
    leerCarrito();
  }).catch(function(error) {
      alert('Hubo un error al eliminar el pedido del carrito:', error)
  });

}

// Esta funcion Lee el carrito del usuario, y lo muestra en la zona del carrito.
function leerCarrito(){
  db.collection("cart").where("userId", "==", firebase.auth().currentUser.uid)
    .get()
    .then(function(querySnapshot) {
      var tabla = '';
      var contador = 0;
        querySnapshot.forEach(function(doc) {
          row = '<div class="row">';
          cardContainter = '<div class="col-3 p-2 d-inline text-center border">';
          productName = '<h4>'+doc.data().productName+'</h4>'
          productPrice = '<span>Precio :'+doc.data().productPrice+'</span>';
          finContainter = '</div>';
          boton = '<br><button type="button" value="'+doc.id+'" onclick="deleteCart(this.value)" class="mt-2 btn btn-danger">Eliminar</button>'
          if(contador == 0){
            tabla = tabla + row;
          }
          tabla = tabla + cardContainter + productName + productPrice + boton + finContainer ;
          if(contador == 3){
            tabla = tabla + finContainer;
          }
          if(contador == 3){
            contador = 0;
          }else if(contador <3){
            contador++;
          }
        });
        document.getElementById('contenidoTabla').innerHTML = tabla;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

}

//Esta funcion imprime todas las comidas que esten registradas en la aplicacion.
function leerTabla(){
  db.collection("comidas").get().then(function(querySnapshot) {
    var tabla="";
    var cada3 = 0;
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        container = '<div class="container col-sm-3 col-md-4 col-lg-6 p-2 border text-center">'
        row = '<div class="row">'
        finContainer = '</div>'
        nComida =  "<p class='lead'>"+doc.data().Nombre+"</p>";
        pComida =  "<p class='lead'> $"+doc.data().Precio+"</p>";
        dComida =  "<p class='lead border p-3'>"+doc.data().Descripcion+"</p>";
        imgComida = '<img class="img-fluid" src="'+doc.data().Imagen+'"></img>';``
        boton = '<button type="button" value="'+doc.id+'" onclick="addCart(this.value)" class="mt-2 btn btn-success">Añadir al carrito</button>'
        if(cada3 == 0){
          tabla = tabla + row;
        }
        tabla = tabla + container + imgComida + nComida + dComida + pComida + boton +finContainer ;
        if (cada3 == 3){
          tabla = tabla + finContainer;

        }
        
        if(cada3 == 3){
          cada3 = 0;
        }else if(cada3 <3){
          cada3++;
        }
    });
    document.getElementById('tablaDatos').innerHTML = tabla;
});
}

// funcion de login de google
function googleLogin(){
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      window.location.replace("./index.html");
      }).catch(function(error) {
      // Handle Errors here.
      document.querySelector("#botongoogle").classList.remove("invisible")
      document.querySelector("#textoerror").innerHTML = "<p>Lo sentimos se ha presentado este error. Codigo: "+error.code+": "+error.message;
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      });
}


// Deslogearse funcion
function signOut(){
  firebase.auth().signOut().then(function() {
    alert("Se ha cerrado tu cuenta")
    window.location.replace("./login.html");
  
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
  }
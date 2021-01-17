# Guia para la configuración de la app de cafetería.

Para poder correr la app en tu compu
```cmd
npm install -g firebase-tools
```
Una vez que lo instales, te diriges a la carpeta del repositorio (osea donde tengas esto) y ejecutas el siguiente comando
```cmd
firebase login
```
Pues abrira una pestaña de google y te metes con tu correo, ya te compartí los permisos para acceder a firebase  
# ya puedes empezar a editar la pagina  
cada cambio que realices y quieras probar puedes correrlo con
```
firebase serve
```
Este comando creará un tipo localhost.
Una vez que hayas terminado con los cambios que hagas lo mandas a firebase, osea corres el siguiente comando
```
firebase deploy --only hosting
```
Y con eso te va a soltar un enlace a la pagina ya hosteada en firebase.

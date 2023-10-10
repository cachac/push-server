# push-server
NodeJS push notification server

1. generar llaves en backend
2. permisos de notificaciones
3. crear ruta para retornar la llave pública
4. crear ruta de suscripción
5. en frontent, recibir la llave pública
6. on load, verificaSuscripcion
7. mostrar banner de notificaciones activadas/desactivadas
8. btn de noti desactivadas, para recibir la suscripcion y enviarla al backend.
9. revisar que el sw envie la suscripcion al back
10. recibir la suscripcion y almacenarla en db
8. cancelar la suscripcion en front
9. configura web push en back: setVapidDetails
10. backend sendPush
11. front sw event listener push
12. push opciones en backend
13. front evento notificationclose
14. front evento notificationclick
15. eliminar suscripciones inválidas
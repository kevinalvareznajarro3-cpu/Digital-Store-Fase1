# Digital Store — App de gestión de ventas (Fase 1)

App conectada a Firebase (Firestore) y Cloudinary, lista para publicar en GitHub Pages.

## Publicar en GitHub Pages
```
unzip digital-store-fase1.zip
cd digital-store-fase1
git init
git add .
git commit -m "Fase 1: Firebase + Cloudinary conectados"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/digital-store.git
git push -u origin main
```
Luego: en GitHub → Settings → Pages → Deploy from branch `main`.

## Instalar como app en el móvil
Abre la URL de GitHub Pages en Chrome → menú (⋮) → "Añadir a pantalla de inicio".

## Credenciales
- Admin: usuario `admin`, contraseña `digital2026`
- Gestores: se crean desde el propio panel de Admin → pestaña "Gestores"

## Qué falta para producción real
Las reglas de Firestore están abiertas (`allow read, write: if true`) para poder probar sin
errores de permisos. Antes de usarla con clientes reales, hay que cerrar esas reglas —
pídele a Claude que te las genere cuando estés listo.

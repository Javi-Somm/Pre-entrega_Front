const API_KEY = "93a7d854bb9543f49790deef1b3049aa";
const API = "https://api.rawg.io/api/games"
const KEY = "?key="
const limitado = "&page_size=5"

const contenedorTienda = document.querySelector(".productosTienda");
const contenedorHome = document.querySelector(".productosHome");

//let productosGlobales = [];

if(contenedorTienda){

    document.getElementById('loader').style.display = "block";

    const pedirTodos = API + KEY + API_KEY;
    
    extraerAPI(pedirTodos, contenedorTienda);

    // fetch(API + KEY + API_KEY)
    //     .then(response => response.json())
    //     .then(data => {
    //         const productos = data.results;
    //         productosGlobales = productos;

    //         const cardsHTML = productos.map(
    //             ({id, background_image, name, rating}) => {
    
    //                 const precio = generarPrecio(rating, id);
    
    //                 return `
    //                     <div class="producto">
    //                         <img src="${background_image}" alt="${name}">
    //                         <div class="producto-descripcion">
    //                             <h3>${name}</h3>
    //                             <p>
    //                                 ${generarEstrellas(rating)}
    //                                 ${rating.toLocaleString("es-AR")}
    //                             </p>
    //                             <h4>$${precio.toLocaleString("es-AR")}</h4>
    //                         </div>
    //                         <button id="btn-ver-${id}" class="ver-descripcion">
    //                             Ver descripción
    //                         </button>    
    //                         <button id="btn-agregar-${id}" class="carrito">
    //                             <i class="fa-solid fa-basket-shopping"></i>
    //                             Agregar
    //                         </button>
    //                     </div>
    //                 `;
    //             })
    //         contenedorTienda.innerHTML = cardsHTML.join('');
    //         document.getElementById('loader').style.display = "none";
    //         adjuntarEventos();   
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
}

if(contenedorHome){
    document.getElementById('loader').style.display = "block";

    const pedirCinco = API + KEY + API_KEY + limitado;

    extraerAPI(pedirCinco, contenedorHome);
}

function extraerAPI(url, contenedor){
    fetch(url)
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data.results, contenedor);
        })
        .catch(error => {
            console.error(error);
        });
}

function mostrarProductos(productos, contenedor){
    const cardsHTML = productos.map(
                ({id, background_image, name, rating}) => {
    
                    const precio = generarPrecio(rating, id);
    
                    return `
                        <div class="producto">
                            <img src="${background_image}" alt="${name}">
                            <div class="producto-descripcion">
                                <h3>${name}</h3>
                                <p>
                                    ${generarEstrellas(rating)}
                                    ${rating.toLocaleString("es-AR")}
                                </p>
                                <h4>$${precio.toLocaleString("es-AR")}</h4>
                            </div>
                            <button id="btn-ver-${id}" class="ver-descripcion">
                                Ver descripción
                            </button>    
                            <button id="btn-agregar-${id}" class="carrito">
                                <i class="fa-solid fa-basket-shopping"></i>
                                Agregar
                            </button>
                        </div>
                    `;
                })
            contenedor.innerHTML = cardsHTML.join('');
            document.getElementById('loader').style.display = "none";
            adjuntarEventos(productos);
}

function generarPrecio(rating, id){

    const base = rating * 10000;

    const variacion = (id % 11 - 5) * 1000;

    const precio = Math.round((base + variacion) / 1000) * 1000 - 1;

    return precio;

    // if(producto.metacritic >= 95){

    //     precio = 79999;

    // }else if(producto.metacritic >= 90){

    //     precio = 69999;

    // }else if(producto.metacritic >= 85){

    //     precio = 59999;

    // }else if(producto.metacritic >= 80){

    //     precio = 49999;

    // }else{

    //     precio = 39999;

    // }   

    // precio += (producto.added % 5) * 1000;
    // precio -= 1;

    // return precio;
}

function generarEstrellas(rating){

    const llenas = Math.round(rating);

    let html = "";

    for(let i = 0; i < llenas; i++){
        html += '<i class="fa-solid fa-star"></i>';
    }

    for(let i = llenas; i < 5; i++){
        html += '<i class="fa-regular fa-star"></i>';
    }

    return html;
}

// MODAL:

function abrirModal(id) {

    document.getElementById('overlayModal').classList.add('visible');
    document.getElementById('infoModal').innerHTML = "";
    document.getElementById('loaderModal').style.display = "block";

    fetch(API + "/" + id + KEY + API_KEY)
        .then(response => response.json())
        .then(data => {

            const desarrolladores = data.developers.map(dev => dev.name).join(", ");
            const anio = data.released.split("-")[0];
            const generos = data.genres.map(genero => genero.name).join(", ");
            const plataformas = data.platforms.map(p => p.platform.name).join(", ");

            document.getElementById('loaderModal').style.display = "none";

            document.getElementById('infoModal').innerHTML = `
                                                            <img src="${data.background_image}" alt="${data.name}">
                                                            <h5>${data.name}</h5>
                                                            <div>
                                                                <p>Desarrolladores:</p>
                                                                <p>${desarrolladores}</p>
                                                            </div>
                                                            <div>
                                                                <p>Lanzamiento:</p>
                                                                <p>${anio}</p>
                                                            </div>
                                                            <div>
                                                                <p>Clasificacion:</p>
                                                                <p>${generarEstrellas(data.rating)} ${data.rating.toLocaleString("es-AR")}</p>
                                                            </div>
                                                            <p>Descripcion:</p>
                                                            <div class="contenedorDescripcion">
                                                                <p>${data.description_raw}</p>
                                                            </div>
                                                            <div>
                                                                <p>Generos:</p>
                                                                <p>${generos}</p>
                                                            </div>
                                                            <div>
                                                                <p>Plataformas:</p>
                                                                <p>${plataformas}</p>
                                                            </div>
                                                            <h4>$${generarPrecio(data.rating, id).toLocaleString("es-AR")}</h4>`;
        })
        .catch(error => {
            console.error(error);
        });
}

function cerrarModal() {
    document.getElementById('overlayModal').classList.remove('visible');
    document.getElementById('infoModal').innerHTML = "";
}

document.addEventListener('DOMContentLoaded', () => {
    const btnCerrarModal = document.getElementById("btnCerrarModal");

    if(btnCerrarModal){
        btnCerrarModal.addEventListener("click", cerrarModal);
        document.getElementById('overlayModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('overlayModal')) {
                cerrarModal();
            }
        })
    }
    //document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal)
})

//TOAST:

function mostrarToast(mensaje){
    const toast = document.getElementById('toast');
    const toastMensaje = document.getElementById('toastMensaje');

    toastMensaje.textContent = mensaje;
    toast.classList.add('visible');
    setTimeout(ocultarToast,4500);
}

function ocultarToast(){
    document.getElementById('toast').classList.remove('visible');
}

document.addEventListener('DOMContentLoaded',()=>{
    const btnCerrarToast = document.getElementById("btnCerrarToast");

    if(btnCerrarToast){
        btnCerrarToast.addEventListener("click", ocultarToast);
    }
})

// AGREGAR AL CARRITO:

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

    const indiceExistente = carrito.findIndex(item => item.id === producto.id);

    if (indiceExistente !== -1) {
        carrito[indiceExistente].cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            title: producto.name,
            price: generarPrecio(producto.rating, producto.id),
            image: producto.background_image,
            cantidad: 1
        });
    }

    localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
    mostrarToast(`${producto.name} agregado al carrito!`);
}

function adjuntarEventos(productos) {
    productos.forEach(producto => {
        const boton = document.getElementById(`btn-agregar-${producto.id}`);
        if (boton) {
            boton.addEventListener('click', () => {
                agregarAlCarrito(producto);
            });
        }

        const btnVer = document.getElementById(`btn-ver-${producto.id}`);
        if (btnVer) {
            btnVer.addEventListener('click', () => {
                abrirModal(producto.id);
            })
        }

    });
}

// CARRITO:

const tabla = document.querySelector("#tabla_carrito");

document.addEventListener('DOMContentLoaded', () => {
    if(tabla){
        cargarProductosCarrito();
    }
});

function cargarProductosCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    const tabla = document.querySelector('#tabla_carrito');
    tabla.innerHTML = '';

    let subtotal = 0;

    if (carrito.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">
                    Tu carrito está vacío. Agregá productos desde la 
                    <a href="tienda.html">tienda</a>.
                </td>
            </tr>`;
    } else {
        carrito.forEach(producto => {
            tabla.innerHTML += crearFilaProducto(producto);
            subtotal += producto.price * producto.cantidad;
        });
    }

    actualizarTotal(subtotal);
    adjuntarEventosFila();
}

function crearFilaProducto(producto) {
    const subtotalProducto = (producto.price * producto.cantidad).toLocaleString("es-AR");
    const titulo = producto.title.substring(0, 20) + '...';
    return `
        <tr>
            <td>
                <button class="remove-btn" data-id="${producto.id}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </td>
            <td>
                <img src="${producto.image}" alt="${producto.title}" 
                     style="height:80px; width:auto; object-fit:contain;">
            </td>
            <td>${titulo}</td>
            <td>$${producto.price.toLocaleString("es-AR")}</td>
            <td>
                <input type="number" value="${producto.cantidad}" min="1" 
                       class="cantidad-producto" data-id="${producto.id}">
            </td>
            <td>$${subtotalProducto}</td>
        </tr>
    `;
}

function actualizarTotal(subtotal) {
    document.querySelectorAll('#total').forEach(el => {
        el.textContent = `$${subtotal.toLocaleString("es-AR")}`;
    });
}

function adjuntarEventosFila() {

    // Eliminar producto
    document.querySelectorAll('.remove-btn').forEach(boton => {
        boton.addEventListener('click', () => {
            let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const id = boton.dataset.id;
            carrito = carrito.filter(item => String(item.id) !== String(id));
            localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
            cargarProductosCarrito();
        });
    });

    // Cambiar cantidad
    document.querySelectorAll('.cantidad-producto').forEach(input => {
        input.addEventListener('change', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const id = input.dataset.id;
            const nuevaCantidad = parseInt(input.value);

            if (nuevaCantidad < 1) {
                input.value = 1;
                return;
            }

            const producto = carrito.find(item => String(item.id) === String(id));
            if (producto) {
                producto.cantidad = nuevaCantidad;
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                recalcularTotales();
            }
        });
    });
}

function recalcularTotales() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    let subtotal = 0;

    document.querySelectorAll('#tabla_carrito tr').forEach(fila => {
        const input = fila.querySelector('.cantidad-producto');
        if (input) {
            const id = input.dataset.id;
            const producto = carrito.find(item => String(item.id) === String(id));
            if (producto) {
                const subtotalFila = (producto.price * producto.cantidad).toLocaleString("es-AR");
                fila.cells[5].textContent = `$${subtotalFila}`;
                subtotal += producto.price * producto.cantidad;
            }
        }
    });

    actualizarTotal(subtotal);
}

// FORMULARIO:

const formulario = document.getElementById('formularioRegistro');
const nombreUsuario = document.getElementById('nombreUsuario');
const correo = document.getElementById('tuCorreo');
const password = document.getElementById('password');
const repetir = document.getElementById('repetir');
const terminos = document.getElementById('terminos');

function mostrarEstadoCampo(input, esValido, mensaje = "") {
    const padre = input.parentNode;
    const textoError = padre.querySelector(".texto-error");
    if(esValido){
        padre.classList.remove("error");
        textoError.textContent = "";
    }else{
        padre.classList.add("error");
        textoError.textContent = mensaje;
    }
}

const esCorreoValido = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
};

formulario.addEventListener("submit",(e)=>{
    e.preventDefault();

    let formularioValido = true;

    if(nombreUsuario.value.trim() === ''){
        mostrarEstadoCampo(nombreUsuario, false,"Ingresá un nombre de usuario.");
        formularioValido = false;
    }else{
        mostrarEstadoCampo(nombreUsuario,true);
    }

    if(correo.value.trim() === '') {
        mostrarEstadoCampo(correo, false, 'El correo electrónico es obligatorio.');
        formularioValido = false;
    }else if(!esCorreoValido(correo.value.trim())) {
        mostrarEstadoCampo(correo, false, 'Ingresá un correo electrónico válido.');
        formularioValido = false;
    }else{
        mostrarEstadoCampo(correo, true);
    }

    if(password.value.trim() === '' || password.value.length < 6){
        mostrarEstadoCampo(password, false, "La contraseña debe tener al menos 6 caracteres.");
        formularioValido = false;
    }else{
        mostrarEstadoCampo(password, true);
    }

    if(repetir.value.trim() === ''){
        mostrarEstadoCampo(repetir, false, "Debes ingresar nuevamente la contraseña.");
        formularioValido = false;
    }else if(repetir.value !== password.value){
        mostrarEstadoCampo(repetir, false, "Las contraseñas no coinciden.");
        formularioValido = false;
    }else{
        mostrarEstadoCampo(repetir, true);
    }

    if(!terminos.checked){
        mostrarEstadoCampo(terminos, false, "Debes aceptar los términos y condiciones.");
        formularioValido = false;
    }else{
        mostrarEstadoCampo(terminos, true);
    }

    if(formularioValido){
        const usuario = {
            nombre: nombreUsuario.value.trim(), 
            correo: correo.value.trim()};

        localStorage.setItem("usuario",JSON.stringify(usuario));

        mostrarToast("¡Registro realizado con éxito!");

        formulario.reset();

        mostrarEstadoCampo(nombreUsuario, true);
        mostrarEstadoCampo(correo, true);
        mostrarEstadoCampo(password, true);
        mostrarEstadoCampo(repetir, true);
        mostrarEstadoCampo(terminos, true);
    }
});
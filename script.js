const API_KEY = "93a7d854bb9543f49790deef1b3049aa";
const URL = `https://api.rawg.io/api/games?key=${API_KEY}`;

const contenedor = document.querySelector(".containerProductos");

fetch(URL)
    .then(response => response.json())
    .then(data => {
        const productos = data.results;
        const cardsHTML = productos.map(
            ({id, background_image, name, rating}) => {
                return `
                    <div class="producto">
                        <img src="${background_image}" alt="${name}">
                        <div class="producto-descripcion">
                            <h3>${name}</h3>
                            <p>⭐ ${rating}</p>
                        </div>    
                        <a id="btn-agregar-${id}" class="carrito">
                            <i class="fa-solid fa-basket-shopping"></i> Agregar
                        </a>
                    </div>
                `;
            })
        contenedor.innerHTML = cardsHTML.join('');    
    })
    .catch(error => {
        console.error(error);
    });
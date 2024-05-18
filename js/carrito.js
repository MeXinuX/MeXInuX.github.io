let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            contenedorCarritoProductos.append(div);
        })
    
    actualizarBotonesEliminar();
    actualizarTotal();
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado+ (totalCalculado*0.16)+(" (IVA $"+totalCalculado*0.16+ ")")}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function descargarProductos(productos) {
    // Crear un texto con los productos y sus precios
    const productosTexto = productos.map(producto => `${producto.titulo} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio}`).join("\n");

    // Calcular el total
    const totalCalculado = productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    const ivaCalculado = totalCalculado * 0.16;

    // Agregar el total y el IVA al texto
    const textoFinal = `${productosTexto}\n\nTotal: $${totalCalculado.toFixed(2)}\nIVA (16%): $${ivaCalculado.toFixed(2)}\nTotal + IVA: $${(totalCalculado + ivaCalculado).toFixed(2)}`;

    // Crear un Blob y descargar el archivo
    const blob = new Blob([textoFinal], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "productos_comprados.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}



function generarFactura() {
    // Mostrar un modal para ingresar los datos de la factura
    Swal.fire({
        title: 'Generar factura',
        html:
            '<input id="rfc" class="swal2-input" placeholder="RFC">' +
            '<input id="nombre" class="swal2-input" placeholder="Nombre o Razón Social">' +
            '<input id="codigoPostal" class="swal2-input" placeholder="Código Postal">' +
            '<input id="direccion" class="swal2-input" placeholder="Dirección">' +
            '<input id="correo" class="swal2-input" placeholder="Correo Electrónico">',
        confirmButtonText: 'Generar factura',
        showCancelButton: true,
        preConfirm: () => {
            return {
                rfc: document.getElementById('rfc').value,
                nombre: document.getElementById('nombre').value,
                codigoPostal: document.getElementById('codigoPostal').value,
                direccion: document.getElementById('direccion').value,
                correo: document.getElementById('correo').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { rfc, nombre, codigoPostal, direccion, correo } = result.value;
            // Guardar los datos de la factura y generar el archivo de texto
            guardarFactura(rfc, nombre, codigoPostal, direccion, correo);
        } else {
            // Limpiar el carrito si se cancela la factura
            productosEnCarrito = [];
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
}


function guardarFactura(rfc, nombre, codigoPostal, direccion, correo) {
    // Crear el texto de la factura
    let facturaTexto = `RFC: ${rfc}\nNombre o Razón Social: ${nombre}\nCódigo Postal: ${codigoPostal}\nDirección: ${direccion}\nCorreo Electrónico: ${correo}\n\nDetalles de la compra:\n`;

    // Agregar los detalles de los productos
    productosEnCarrito.forEach(producto => {
        facturaTexto += `${producto.titulo} - Cantidad: ${producto.cantidad} - Precio unitario: $${producto.precio.toFixed(2)}\n`;
    });

    // Calcular el total y el IVA
    const totalCalculado = productosEnCarrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    const ivaCalculado = totalCalculado * 0.16;

    // Agregar el total y el IVA
    facturaTexto += `\nTotal: $${totalCalculado.toFixed(2)}\nIVA (16%): $${ivaCalculado.toFixed(2)}\nTotal + IVA: $${(totalCalculado + ivaCalculado).toFixed(2)}`;

    // Crear un Blob y descargar el archivo
    const blob = new Blob([facturaTexto], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "factura.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Limpiar el carrito después de generar la factura
    productosEnCarrito = [];
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}


function comprarCarrito() {
    // Generar la factura
    generarFactura();
    descargarProductos(productosEnCarrito);
}

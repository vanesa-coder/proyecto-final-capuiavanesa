const nuestroMenu = document.getElementById("menu");
  const misPedidos = document.getElementById("miPedido");
  const btnConfirmarPedido = document.getElementById("btnConfirmarPedido");

  //Muestro los productos de la categoría clickeada (filtra la categoría, la recorre y crea el div con los productos, su precio y un boton para agregar a la orden)
  function muestroMenu(categoria) {
    fetch("./menu.json")
    .then(response => response.json())
    .then(data => {
    nuestroMenu.innerHTML = "";
    const categoriaItems = data.filter(item => item.categoria === categoria);
    
    categoriaItems.forEach(item => {
      const menuItem = document.createElement("div");
      menuItem.innerHTML = `
        <div class="lista">
        <p>${item.producto} ..... $${item.precio}</p>
        <button class="agregarBtn" data-id="${item.id}">Agregar</button>
        </div>
      `;
      nuestroMenu.appendChild(menuItem);
      })
      const agregarButtons = nuestroMenu.querySelectorAll(".agregarBtn");
      
      agregarButtons.forEach(button =>{
        button.addEventListener("click", ()=>{
          miPedido(categoriaItems)
        })
      })
    });
  }
  // funcion para tomar pedidos y los guardo en el div creado donde va a estar el nombre y el precio del producto y un boton para eliminar el producto si no desea ordenarlo.
  function tomarPedido() {
    misPedidos.innerHTML = "";
    let total = 0;
    const miPedido = JSON.parse(localStorage.getItem("miPedido") || "[]");

    miPedido.forEach(item => {
      const pedidoItem = document.createElement("div");
      pedidoItem.innerHTML = `
        <div class="eliminar">
        <p>${item.producto} - $${item.precio}</p>
        <button class="eliminarBtn" data-id="${item.id}">X</button>
        </div>
      `;
      misPedidos.appendChild(pedidoItem);
      total += item.precio; // va sumando el precio de los productos seleccionados
    });

    misPedidos.innerHTML += `<p class="miOrden">Mi orden: $${total}</p>`; // muestra el total de los productos seleccionados
  }
 //en el menu de la categoria seleccionada, cuando clickea en el boton agregar, se guarda el item seleccionado
 
    function miPedido(categoriaItems){
      const itemId = parseInt(event.target.getAttribute("data-id"));
      const seleccionItem = categoriaItems.find(item => item.id === itemId);
      const miPedido = JSON.parse(localStorage.getItem("miPedido") || "[]");
      miPedido.push(seleccionItem);
      localStorage.setItem("miPedido", JSON.stringify(miPedido));
      tomarPedido();
    }

    

  // elimina item seleccionado
  misPedidos.addEventListener("click", event => {
    if (event.target.classList.contains("eliminarBtn")) {
      const itemId = parseInt(event.target.getAttribute("data-id"));
      const miPedido = JSON.parse(localStorage.getItem("miPedido") || "[]");
      const tomardPedido = miPedido.filter(item => item.id !== itemId);
      localStorage.setItem("miPedido", JSON.stringify(tomardPedido));
      tomarPedido();
    }
  });
  //cuando confirma el pedido le da la alerta del pedido confirmado
  btnConfirmarPedido.addEventListener("click", () => {
    Swal.fire(
      'Pedido confirmado!!',
      'En breve recibirá su orden',
      'success'
    )
    localStorage.removeItem("miPedido");
    tomarPedido();
  });

  document.getElementById("btnCafeteria").addEventListener("click", () => muestroMenu("cafeteria"));
  document.getElementById("btnAlmuerzos").addEventListener("click", () => muestroMenu("almuerzos"));
  document.getElementById("btnBebidas").addEventListener("click", () => muestroMenu("bebidas"));
  document.getElementById("btnPostres").addEventListener("click", () => muestroMenu("postres"));

  tomarPedido();

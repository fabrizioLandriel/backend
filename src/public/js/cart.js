const addToCart = async (pid) => {
  let cartInput = document.getElementById("cart");
  let cid = cartInput.value;
  let res = await fetch(
    `http://localhost:8081/api/carts/${cid}/product/${pid}`,
    { method: "post" }
  );
  if (res.status === 200) {
    Toastify({
      text: `Product ${pid} added`,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      duration: 3000,
    }).showToast();
  }
};

const removeFromCart = async (pid) => {
  let cartInput = document.getElementById("cart");
  let cid = cartInput.value;
  let res = await fetch(
    `http://localhost:8081/api/carts/${cid}/product/${pid}`,
    { method: "delete" }
  );
  if (res.status === 200) {
    Toastify({
      text: `Product ${pid} deleted`,
      style: {
        background: "linear-gradient(to right, #ff4b2b, #ff416c)",
      },
      duration: 3000,
    }).showToast();
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
};

const purchase = async (cid) => {
  let res = await fetch(`http://localhost:8081/api/carts/${cid}/purchase`, {
    method: "post",
  });
  let data = await res.json();

  if (res.status === 200) {
    if (data.ticket) {
      Swal.fire({
        title: "Compra realizada con exito",
        icon: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      Swal.fire({
        title: "Productos sin stock suficiente",
        icon: "error",
      });
    }
  } else {
    return;
  }
};

const getTotalPrice = async () => {
  let cartInput = document.getElementById("cart");
  let cid = cartInput.value;
  let res = await fetch(`http://localhost:8081/api/carts/${cid}`);
  let data = await res.json();
  let totalPrice = data.cartById.products.reduce((accumulator, products) => {
    let productPrice = Number(products.product.price);
    let productQuantity = Number(products.quantity);
    return accumulator + productPrice * productQuantity;
  }, 0);
  let totalPriceDiv = document.getElementById("precioTotal");
  totalPriceDiv.innerHTML = `<p id="precioTotal">El precio total es de: $${totalPrice}</p>`;
};
getTotalPrice();

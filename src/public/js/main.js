const socket= io()

socket.emit('mensaje', 'Cliente conectado')

document.getElementById('btnSend').addEventListener('click', () => {
    let estadoSelect = document.getElementById('status').value
    let estadoBooleano = estadoSelect === "true"
    const product = {
        title : document.getElementById('title').value,
        description : document.getElementById('description').value,
        price : Number(document.getElementById('price').value),
        thumbnail: document.getElementById('thumbnail').value,
        code: document.getElementById('code').value,
        stock: Number(document.getElementById('stock').value),
        status: estadoBooleano,
        category: document.getElementById('category').value
    }
    if(estadoBooleano === true && product.title && product.description && product.price && product.code && product.category && product.stock){
        socket.emit('prod', product)
        addProduct(product)
    }
    else if(estadoBooleano === false && product.code){
        socket.emit('deleteProd', product.code)
    }
})

socket.on("prodsJson", (data) => {
    fetch(data)
        .then (response => response.json())
        .then (data => {
            productsList(data.payload)
        })
    })

function productsList(everyProd){
    const productsArray = document.getElementById('containerProducts')
    productsArray.innerHTML = ''
    everyProd.forEach(prod => {
    productsArray.innerHTML +=
    `
        <p>${prod.title}</p>
        <p>${prod.description}</p>
        <p>${prod.price}</p>
        <p>${prod.thumbnail}</p>
        <p>${prod.code}</p>
        <p>${prod.stock}</p>
        <p>${prod.status}</p>
        <p>${prod.category}</p>
    `
    })
}

function addProduct(prod) {
    const productsArray = document.getElementById('containerProducts')
    productsArray.innerHTML +=
    `
        <p>${prod.title}</p>
        <p>${prod.description}</p>
        <p>${prod.price}</p>
        <p>${prod.thumbnail}</p>
        <p>${prod.code}</p>
        <p>${prod.stock}</p>
        <p>${prod.status}</p>
        <p>${prod.category}</p>
    `
}

document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const container = document.getElementById("products-container");
    const form = document.getElementById("productForm");

    // Renderiza los productos como cards
    function renderProducts(products) {
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML =
                '<div class="col-12"><p class="text-center text-muted">No hay productos.</p></div>';
            return;
        }

        container.innerHTML = products.map((p) => `
    <div class="col">
        <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title || "Sin título"}</h5>
            <p class="card-text flex-grow-1">${p.description || ""}</p>
            <div class="mt-auto">
            <div class="d-flex justify-content-between">
                <span class="badge bg-primary">Stock: ${p.stock || 0}</span>
                <span class="badge bg-secondary">Código: ${p.code || "N/A"}</span>
            </div>
            <p class="fs-5 fw-bold text-primary mt-2 mb-0">$${p.price || 0}</p>
            <button 
                class="btn btn-outline-danger btn-sm mt-2"
                onclick="deleteProduct('${p._id}')"
            >
                Eliminar
            </button>
            </div>
        </div>
    </div>
</div>
`).join("");
}

    // Escuchar actualizaciones en tiempo real
    socket.on("productsUpdated", renderProducts);

    // Enviar nuevo producto
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const newProduct = {
                title: form.title.value.trim(),
                description: form.description.value.trim(),
                price: parseFloat(form.price.value) || 0,
                stock: parseInt(form.stock.value) || 0,
                code: form.code.value.trim(),
                category: form.category.value.trim(),
                status: true,
                thumbnails: [],
            };

            try {
                const res = await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newProduct),
                });

                if (res.ok) {
                    form.reset();
                } else {
                    alert("Error al crear el producto");
                }
            } catch (err) {
                console.error("Error:", err);
                alert("Error de conexión");
            }
        });
    }

    // Eliminar producto
    window.deleteProduct = async (id) => {
        if (!confirm("¿Eliminar este producto?")) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) alert("Error al eliminar");
        } catch (err) {
            console.error("Error:", err);
            alert("Error de conexión");
        }
    };
});

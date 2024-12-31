document.addEventListener("DOMContentLoaded", () => {
    // Initialize or retrieve the cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to save cart to localStorage
    const saveCart = () => localStorage.setItem("cart", JSON.stringify(cart));

    // Add to Cart functionality (for product.html)
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const productCard = button.closest(".card");
            const product = productCard.querySelector(".card-title").innerText;
            const price = parseFloat(
                productCard.querySelector(".card-text").innerText.replace("₹", "").trim()
            );

            // Check if the product is already in the cart
            const existingItem = cart.find(item => item.product === product);
            if (existingItem) {
                existingItem.quantity += 1; // Increment quantity
            } else {
                cart.push({ product, price, quantity: 1 }); // Add new item
            }

            saveCart(); // Update localStorage
            Swal.fire({
                title: 'Added to Cart!',
                text: `${product} has been added to your cart.`,
                icon: 'success',
                confirmButtonText: 'View Cart',
                cancelButtonText: 'Continue Shopping',
                showCancelButton: true,
                backdrop: true, // Optional: adds a dark backdrop behind the popup
            }).then((result) => {
                if (result.isConfirmed) {
                    // Navigate to the cart page if "View Cart" is clicked
                    window.location.href = 'cart.html';
                }
            });
        });
        
    });

    // Load cart functionality (for cart.html)
    const cartTableBody = document.getElementById("cartItems");
    if (cartTableBody) {
        const renderCart = () => {
            cartTableBody.innerHTML = ""; // Clear table
            if (cart.length === 0) {
                cartTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">No items in cart</td>
                    </tr>
                `;
                return;
            }

            // Populate table rows
            cart.forEach((item, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.product}</td>
                    <td>
                        <input type="number" min="1" value="${item.quantity}" class="form-control quantity-input" data-index="${index}">
                    </td>
                    <td>₹${item.price.toFixed(2)}</td>
                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Remove</button>
                    </td>
                `;
                cartTableBody.appendChild(row);
            });
        };

        cartTableBody.addEventListener("input", event => {
            if (event.target.classList.contains("quantity-input")) {
                const index = parseInt(event.target.dataset.index, 10);
                const newQuantity = parseInt(event.target.value, 10);
                if (newQuantity > 0) {
                    cart[index].quantity = newQuantity;
                    saveCart();
                    renderCart(); // Re-render cart
                }
            }
        });

        cartTableBody.addEventListener("click", event => {
            if (event.target.classList.contains("remove-btn")) {
                const index = parseInt(event.target.dataset.index, 10);
                const itemName = cart[index].product; // Get the product name for the confirmation dialog
        
                // SweetAlert2 Confirmation Dialog
                Swal.fire({
                    title: 'Are you sure?',
                    text: `Do you want to remove "${itemName}" from your cart?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, remove it!',
                    cancelButtonText: 'Cancel',
                    dangerMode: true, // Optional: Makes the confirm button red
                }).then((result) => {
                    if (result.isConfirmed) {
                        // If the user confirms, remove the item
                        cart.splice(index, 1); // Remove item from cart
                        saveCart();
                        renderCart(); // Re-render cart
        
                        // Show success message
                        Swal.fire({
                            title: 'Removed!',
                            text: `"${itemName}" has been removed from your cart.`,
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                });
            }
        });
        

        renderCart(); // Initial render
    }
});

// Variables globales
let cart = [];
let products = [];

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    // Charger le panier depuis le localStorage
    loadCart();
    
    // Initialiser les produits
    initializeProducts();
    
    // Configurer les écouteurs d'événements
    setupEventListeners();
    
    // Afficher les produits
    displayProducts();
    
    // Mettre à jour l'affichage du panier
    updateCartDisplay();
});

// Initialiser les produits
function initializeProducts() {
    products = [
        {
            id: 1,
            name: "Trappeur homme LV ",
            price: 5000,
            image: "https://cdn.discordapp.com/attachments/915464210463457290/1430207795751288944/5E13479E-E120-4D7F-A456-4D2E4D44CD88.png?ex=68f8f04e&is=68f79ece&hm=bffce6b35a54c65190af2028c8470c51c5590653c4b62bf2dbcf563b3066c9ce&"
        },
        {
            id: 2,
            name: "Ck bleu nuit ",
            price: 12000,
            image: "https://media.discordapp.net/attachments/915464210463457290/1430207851367759873/01FB42B0-F0E9-4FBA-A44B-2C0E021A2B10.png?ex=68f8f05b&is=68f79edb&hm=a0ea3549f600300d6101fa5d97627caa8f80b0742cf82b52d8d07ce15a52c2f5&=&format=webp&quality=lossless&width=858&height=903"
        },
        {
            id: 3,
            name: "Basket Boss Super good ",
            price: 9000,
            image: "https://media.discordapp.net/attachments/915464210463457290/1430207883387338832/8093264B-790E-4FD2-99E9-92564999A022.png?ex=68f8f063&is=68f79ee3&hm=b1b3e2df38798eb7b4f8f475da8d7705eec77bf539f4e2524de7dcb94c998c3a&=&format=webp&quality=lossless&width=696&height=855"
        },
        {
            id: 4,
            name: "Adidas CAMPUS",
            price: 10900,
            image: "https://media.discordapp.net/attachments/915464210463457290/1430207928085909535/21472541-F64E-4889-968D-55FBBE37B415.png?ex=68f8f06e&is=68f79eee&hm=a9fcc38846fbb8c247352be84425665986a2411457a8819210524498535eacfe&=&format=webp&quality=lossless&width=333&height=385"
        },
        {
            id: 5,
            name: "Campus gris",
            price: 10000,
            image: "https://media.discordapp.net/attachments/915464210463457290/1430208813314871306/0D90E65F-C08B-4658-B48F-E82BFDAAC240.png?ex=68f8f141&is=68f79fc1&hm=64f9e54df8d5b7275c5757c48a274ac3b7fe469f1cc28c420db1cd400a3cddce&=&format=webp&quality=lossless&width=312&height=385"
        },
        {
            id: 6,
            name: "Campus",
            price: 14999,
            image: "https://media.discordapp.net/attachments/915464210463457290/1430208898174025810/FEDA4F10-10CD-4282-A287-D811CCFD5457.png?ex=68f8f155&is=68f79fd5&hm=840fed894e14d57df67612aded598ae3e1611d0c7760be625d8f28161d0bf11f&=&format=webp&quality=lossless&width=310&height=385"
        }
    ];
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Menu hamburger pour mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Fermer le menu hamburger quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Gestion du modal du panier
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartModal.style.display = 'block';
            displayCartItems();
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    // Fermer le modal en cliquant en dehors
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Bouton de commande
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processOrder);
    }
    
    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Merci pour votre message ! Nous vous répondrons bientôt.');
            contactForm.reset();
        });
    }
}

// Afficher les produits dans la grille
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price.toFixed(2)} DZD</p>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Ajouter au panier</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Ajouter les écouteurs d'événements aux boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Charger le panier depuis le localStorage
function loadCart() {
    const savedCart = localStorage.getItem('basketStoreCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Sauvegarder le panier dans le localStorage
function saveCart() {
    localStorage.setItem('basketStoreCart', JSON.stringify(cart));
}

// Ajouter un produit au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    
    // Afficher une notification
    showNotification(`${product.name} a été ajouté au panier !`);
}

// Afficher une notification
function showNotification(message) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1002;
        transition: opacity 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Mettre à jour l'affichage du panier (icône et compteur)
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Afficher les articles dans le modal du panier
function displayCartItems() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide.</p>';
        if (cartTotalPrice) cartTotalPrice.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)} DZD</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                <button class="remove-btn" data-id="${item.id}">Supprimer</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    if (cartTotalPrice) {
        cartTotalPrice.textContent = total.toFixed(2);
    }
    
    // Ajouter les écouteurs d'événements pour les boutons de quantité et de suppression
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Mettre à jour la quantité d'un produit dans le panier
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartDisplay();
        displayCartItems(); // Re-afficher les articles pour mettre à jour les quantités
    }
}

// Supprimer un produit du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    displayCartItems();
}

// Traiter la commande
function processOrder() {
    if (cart.length === 0) {
        alert('Votre panier est vide. Ajoutez des produits avant de commander.');
        return;
    }
    
    // Demander les informations du client
    const customerName = prompt('Veuillez entrer votre nom:');
    if (!customerName) {
        alert('Le nom est requis pour passer une commande.');
        return;
    }
    
    const customerEmail = prompt('Veuillez entrer votre email:');
    if (!customerEmail) {
        alert('L\'email est requis pour passer une commande.');
        return;
    }
    
    // Calculer le total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Créer l'objet commande
    const order = {
        id: Date.now(), // ID unique basé sur le timestamp
        customerName: customerName,
        customerEmail: customerEmail,
        items: cart,
        total: total,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    // Envoyer la commande à Firebase
    sendOrderToFirebase(order);
}

// Envoyer la commande à Firebase
function sendOrderToFirebase(order) {
    // Référence à la base de données Firebase
    const ordersRef = database.ref('orders');
    
    // Ajouter la commande
    ordersRef.push(order)
        .then(() => {
            // Succès
            alert('Commande passée avec succès ! Merci pour votre achat.');
            
            // Vider le panier
            cart = [];
            saveCart();
            updateCartDisplay();
            displayCartItems();
            
            // Fermer le modal
            document.getElementById('cart-modal').style.display = 'none';
        })
        .catch(error => {
            // Erreur
            console.error('Erreur lors de l\'envoi de la commande:', error);
            alert('Une erreur est survenue lors de l\'envoi de votre commande. Veuillez réessayer.');
        });
}
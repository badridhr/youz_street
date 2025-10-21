// Variables globales
let orders = [];

// Initialisation de la page admin
document.addEventListener('DOMContentLoaded', function() {
    // Configurer les écouteurs d'événements
    setupAdminEventListeners();
    
    // Charger les commandes depuis Firebase
    loadOrders();
});

// Configurer les écouteurs d'événements pour l'admin
function setupAdminEventListeners() {
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
    
    // Bouton d'actualisation des commandes
    const refreshBtn = document.getElementById('refresh-orders');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadOrders);
    }
}

// Charger les commandes depuis Firebase
function loadOrders() {
    const ordersRef = database.ref('orders');
    
    ordersRef.on('value', (snapshot) => {
        orders = [];
        const data = snapshot.val();
        
        if (data) {
            // Convertir l'objet Firebase en tableau
            Object.keys(data).forEach(key => {
                orders.push({
                    firebaseId: key,
                    ...data[key]
                });
            });
        }
        
        // Afficher les commandes
        displayOrders();
    });
}

// Afficher les commandes dans le tableau
function displayOrders() {
    const ordersTableBody = document.getElementById('orders-table-body');
    const noOrders = document.getElementById('no-orders');
    
    if (!ordersTableBody) return;
    
    ordersTableBody.innerHTML = '';
    
    if (orders.length === 0) {
        if (noOrders) noOrders.style.display = 'block';
        return;
    }
    
    if (noOrders) noOrders.style.display = 'none';
    
    // Trier les commandes par date (plus récentes en premier)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    orders.forEach(order => {
        const orderRow = document.createElement('tr');
        
        // Formater la date
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Créer la liste des produits
        let productsList = '';
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                productsList += `${item.name} (x${item.quantity})<br>`;
            });
        }
        
        // Déterminer la classe de statut
        const statusClass = order.status === 'completed' ? 'status-completed' : 'status-pending';
        const statusText = order.status === 'completed' ? 'Traité' : 'En attente';
        
        orderRow.innerHTML = `
            <td>${order.id}</td>
            <td>${formattedDate}</td>
            <td>
                <strong>${order.customerName}</strong><br>
                ${order.customerEmail}
            </td>
            <td>${productsList}</td>
            <td>${order.total ? order.total.toFixed(2) + ' €' : 'N/A'}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>
                ${order.status !== 'completed' ? 
                    `<button class="action-btn btn-complete" data-id="${order.firebaseId}">Marquer comme traité</button>` : 
                    ''
                }
                <button class="action-btn btn-delete" data-id="${order.firebaseId}">Supprimer</button>
            </td>
        `;
        
        ordersTableBody.appendChild(orderRow);
    });
    
    // Ajouter les écouteurs d'événements aux boutons d'action
    document.querySelectorAll('.btn-complete').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            markOrderAsCompleted(orderId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            deleteOrder(orderId);
        });
    });
}

// Marquer une commande comme traitée
function markOrderAsCompleted(orderId) {
    const orderRef = database.ref('orders/' + orderId);
    
    orderRef.update({
        status: 'completed'
    })
    .then(() => {
        console.log('Commande marquée comme traitée');
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        alert('Une erreur est survenue lors de la mise à jour de la commande.');
    });
}

// Supprimer une commande
function deleteOrder(orderId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
        const orderRef = database.ref('orders/' + orderId);
        
        orderRef.remove()
        .then(() => {
            console.log('Commande supprimée avec succès');
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de la commande:', error);
            alert('Une erreur est survenue lors de la suppression de la commande.');
        });
    }
}
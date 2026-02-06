// Número do WhatsApp para pedidos
const WHATSAPP_NUMBER = '5531993963699';

// Carrinho de compras
let cart = [];

// Atualiza a quantidade de um item
function updateQuantity(button, change) {
    const menuItem = button.closest('.menu-item');
    const quantitySpan = menuItem.querySelector('.quantity');
    const name = menuItem.dataset.name;
    const price = parseFloat(menuItem.dataset.price);

    let quantity = parseInt(quantitySpan.textContent) + change;
    if (quantity < 0) quantity = 0;

    quantitySpan.textContent = quantity;

    // Atualiza o carrinho
    updateCart(name, price, quantity);
}

// Atualiza o carrinho
function updateCart(name, price, quantity) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        if (quantity === 0) {
            cart = cart.filter(item => item.name !== name);
        } else {
            existingItem.quantity = quantity;
        }
    } else if (quantity > 0) {
        cart.push({ name, price, quantity });
    }

    updateCartUI();
}

// Atualiza a interface do carrinho
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartFloat = document.getElementById('cartFloat');

    // Conta total de itens
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Animação do carrinho
    cartFloat.classList.add('bounce');
    setTimeout(() => cartFloat.classList.remove('bounce'), 300);

    // Renderiza itens do carrinho
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
        `).join('');
    }

    // Calcula total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Abre/fecha o modal do carrinho
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
}

// Fecha o modal ao clicar fora
document.getElementById('cartModal').addEventListener('click', function(e) {
    if (e.target === this) {
        toggleCart();
    }
});

// Envia pedido para o WhatsApp
function sendToWhatsApp() {
    if (cart.length === 0) {
        alert('Adicione itens ao carrinho antes de enviar o pedido!');
        return;
    }

    // Pega os dados do formulário
    const customerName = document.getElementById('customerName').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const customerComplement = document.getElementById('customerComplement').value.trim();

    // Valida campos obrigatórios
    if (!customerName) {
        alert('Por favor, informe seu nome!');
        document.getElementById('customerName').focus();
        return;
    }

    if (!customerAddress) {
        alert('Por favor, informe o endereço de entrega!');
        document.getElementById('customerAddress').focus();
        return;
    }

    // Monta a mensagem
    let message = '🛒 *NOVO PEDIDO - D&T Delícias*\n\n';

    message += '👤 *CLIENTE*\n';
    message += `Nome: ${customerName}\n\n`;

    message += '📍 *ENDEREÇO DE ENTREGA*\n';
    message += `${customerAddress}\n`;
    if (customerComplement) {
        message += `${customerComplement}\n`;
    }
    message += '\n';

    message += '━━━━━━━━━━━━━━━━━━━━\n';
    message += '📋 *ITENS DO PEDIDO*\n';
    message += '━━━━━━━━━━━━━━━━━━━━\n\n';

    cart.forEach(item => {
        const subtotal = (item.price * item.quantity).toFixed(2).replace('.', ',');
        message += `▪️ ${item.name}\n`;
        message += `   ${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')} = *R$ ${subtotal}*\n\n`;
    });

    message += '━━━━━━━━━━━━━━━━━━━━\n';

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `💰 *TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;

    message += '⏳ Aguardando confirmação do pedido!';

    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);

    // Abre o WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Inicializa a UI
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
});

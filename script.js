// Setup PayPal buttons for a product
function setupPayPal(buttonSelector, price, productName, downloadLink, successURL) {
  paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'paypal',
    },
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: { value: price },
          description: productName,
        }],
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        alert(`Thank you, ${details.payer.name.given_name}!`);

        // Send confirmation email with product info
        fetch('/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyerEmail: details.payer.email_address,
            buyerName: details.payer.name.given_name,
            productName: productName,
            downloadLink: downloadLink,
          }),
        })
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => console.log('Email confirmation:', data.message))
        .catch(err => console.error('Email sending failed:', err));

        // Redirect to success page
        window.location.href = successURL;
      });
    },
    onError: (err) => {
      console.error('PayPal error:', err);
      alert('Sorry, something went wrong with the payment. Please try again later.');
    }
  }).render(buttonSelector);
}

// Initialize PayPal buttons after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  setupPayPal('#paypal-button-container-1', '4.00', 'Pastel Bloom Sticker Sheet', '/pdfs/pastel-bloom.pdf', 'success.html');
  setupPayPal('#paypal-button-container-2', '4.00', 'Slow Brew – Café Aesthetic Sticker Sheet', '/pdfs/slow-brew.pdf', 'success.html');
  setupPayPal('#paypal-button-container-3', '4.00', 'Whimsy Journals Sticker Sheet', '/pdfs/whimsy-journals.pdf', 'success.html');
});

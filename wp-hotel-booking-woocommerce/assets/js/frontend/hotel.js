/**
 * WooCommerce Blocks integration for Hotel Booking
 * Displays check-in and check-out dates for hb_room products in cart/checkout blocks
 */

(function () {
    'use strict';

    // Wait for WooCommerce Blocks to be ready
    const initializeHotelBookingBlocks = () => {
        // Check if WooCommerce Blocks checkout filters are available
        if (!window.wc || !window.wc.blocksCheckout || !window.wc.blocksCheckout.registerCheckoutFilters) {
            return false;
        }

        const { registerCheckoutFilters } = window.wc.blocksCheckout;

        // Register filters for WooCommerce Blocks cart
        registerCheckoutFilters('hotel-booking-dates', {
            itemName: (value, extensions, args) => {
                // Access booking dates from the hotel-booking namespace in extensions
                const hotelData = extensions?.['wp-hotel-booking'];

                // Check if we have booking dates in the extension data
                if (!hotelData || !hotelData.check_in_date || !hotelData.check_out_date) {
                    return value;
                }

                // Create the dates HTML to append
                const datesHtml = `
				<div class="hb-room-booking-dates">
					<div class="hb-check-in-date">
						<strong>${wphbWcSettings.checkin}:</strong> <span>${hotelData.check_in_date}</span>
					</div>
					<div class="hb-check-out-date">
						<strong>${wphbWcSettings.checkout}:</strong> <span>${hotelData.check_out_date}</span>
					</div>
				</div>
			`;

                return value + datesHtml;
            },

            // Add custom class for hotel extra items
            cartItemClass: (value, extensions, args) => {
                const hotelData = extensions?.['wp-hotel-booking'];

                // Add custom class if this is a hotel extra product
                if (hotelData && hotelData.is_hotel_extra === true) {
                    return `${value} hb-hotel-extra-item`;
                }

                return value;
            }
        });

        return true;
    };

    // Try to initialize with retries
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = 300; // ms

    const tryInitialize = () => {
        if (initializeHotelBookingBlocks()) {
            return; // Success
        }

        retryCount++;
        if (retryCount < maxRetries) {
            setTimeout(tryInitialize, retryInterval);
        } else {
            console.warn('Hotel Booking: WooCommerce Blocks not available after retries. Blocks integration disabled.');
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInitialize);
    } else {
        tryInitialize();
    }
})();

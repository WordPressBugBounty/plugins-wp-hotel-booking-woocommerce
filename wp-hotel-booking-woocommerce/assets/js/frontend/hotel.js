/**
 * WooCommerce Blocks integration for Hotel Booking
 * Displays additional info for hb_room products in cart/checkout blocks
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
        registerCheckoutFilters('hotel-booking-additional-info', {
            itemName: (value, extensions, args) => {
                const hotelData = extensions?.['wp-hotel-booking'];

                if (!hotelData || !hotelData.additional_info ) {
                    return value;
                }

                // Create the additional HTML to append
                const additionalInfoHtml = `
				<div class="hb-room-booking-additional-info">
					${hotelData.additional_info}
				</div>
			`;

                return value + additionalInfoHtml;
            },

            // Add custom class for hotel extra items
            cartItemClass: (value, extensions, args) => {
                const hotelData = extensions?.['wp-hotel-booking'];
                console.log(hotelData);
                // Add custom class if this is a hotel extra product
                if (hotelData && hotelData.is_hotel_extra === true) {
                    return `${value} hb-hotel-extra-item`;
                }

                return value;
            },
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

    tryInitialize();
})();

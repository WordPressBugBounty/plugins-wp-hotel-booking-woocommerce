<?php
/**
 * HB_WC_Settings
 *
 * @author   ThimPress
 * @package  WP-Hotel-Booking/Woocommerce/Classes
 * @version  1.9.0
 */

// Prevent loading this file directly
defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'WPHB_Settings' ) ) {
	return;
}

if ( ! class_exists( 'HB_WC_Settings' ) ) {
	/**
	 * Class HB_WC_Settings
	 */
	class HB_WC_Settings extends WPHB_Settings {

		/**
		 * HB_WC_Settings constructor.
		 */
		public function __construct() {
			// settings page
			add_filter( 'hotel_booking_admin_setting_pages', array( $this, 'admin_settings' ) );
		}

		/**
		 * Setting view.
		 */
		public function admin_settings( $tabs ) {
			$tabs[] = include_once 'admin/settings/class-wphb-admin-setting-woo.php';
			return $tabs;
		}
	}
}

return new HB_WC_Settings();

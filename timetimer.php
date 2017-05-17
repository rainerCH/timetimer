<?php

	/*
	 Plugin Name: Timetimer
	 Plugin URI: https://github.com/rainerCH/timetimer
	 Description: Timetimer
	 Version: 1.0.0
	 Author: rdemmler
	 Author URI: https://indielab.ch/
	 */

	defined( 'ABSPATH' ) or die( 'Plugin file cannot be accessed directly.' );
	
	
	if ( !class_exists( 'Timetimer' ) ) {
		class Timetimer
		{
			
			/**
			 * Tag identifier used by file includes and selector attributes.
			 * @var string
			 */
			protected $tag = 'Timetimer';
			
			/**
			 * User friendly name used to identify the plugin.
			 * @var string
			 */
			protected $name = 'Timetimer';
			
			/**
			 * Current version of the plugin.
			 * @var string
			 */
			protected $version = '1.0.0';
			
			private $plugin_path;
			
			public function __construct()
			{
				add_shortcode( $this->tag, array( &$this, 'start' ) );
				$this->plugin_path = plugin_dir_url( __FILE__ );

				if ( !wp_style_is( $this->tag, 'enqueued' ) ) {
					wp_enqueue_style(
					$this->tag,
					$this->plugin_path . 'timetimer.min.css',
					array(),
					$this->version
					);
				}

				if( !wp_script_is( $this->tag, 'enqueued' )) {
					wp_enqueue_script(
					$this->tag,
					$this->plugin_path . 'timetimer.min.js',
					array(),
					$this->version,
					true				
					);
				}

			}

			function start() {
?>


<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="timetimer-clock" viewBox="0 0 100 130">
	<rect x="0" y="10" width="100" height="100" fill="#000000"/>
	<rect x="2.5" y="12.5" width="95" height="95" fill="#FFFFFF"/>
	<text x='50' y='20' class='digit' data-time='60' text-anchor='middle' alignment-baseline='middle'>0</text>
	<text x='30' y='25.359' class='digit' data-time='5' text-anchor='middle' alignment-baseline='middle'>5</text>
	<text x='15.359' y='40' class='digit' data-time='10' text-anchor='middle' alignment-baseline='middle'>10</text>
	<text x='10' y='60' class='digit' data-time='15' text-anchor='middle' alignment-baseline='middle'>15</text>
	<text x='15.359' y='80' class='digit' data-time='20' text-anchor='middle' alignment-baseline='middle'>20</text>
	<text x='30' y='94.641' class='digit' data-time='25' text-anchor='middle' alignment-baseline='middle'>25</text>
	<text x='50' y='100' class='digit' data-time='30' text-anchor='middle' alignment-baseline='middle'>30</text>
	<text x='70' y='94.641' class='digit' data-time='35' text-anchor='middle' alignment-baseline='middle'>35</text>
	<text x='84.641' y='80' class='digit' data-time='40' text-anchor='middle' alignment-baseline='middle'>40</text>
	<text x='90' y='60' class='digit' data-time='45' text-anchor='middle' alignment-baseline='middle'>45</text>
	<text x='84.641' y='40' class='digit' data-time='50' text-anchor='middle' alignment-baseline='middle'>50</text>
	<text x='70' y='25.359' class='digit' data-time='55' text-anchor='middle' alignment-baseline='middle'>55</text>

	<path id="timetimer-path" fill="#E3223d" d="M 50 60 v -35 A 35 35 1 0 0 15 60 z"/>
	<circle id="timetimer-centerpoint" cx="50" cy="60" r="2" fill="#000000"/>
	<text id="timetimer-display" x='50' y='120' text-anchor='middle' alignment-baseline='middle' font-size="10">00:00:00</text>

</svg>
<button id="timetimer-startstop" class="go">Start!</button>
<audio id="timetimer-audioalarm">
</audio>


<?php
			}
		}
			
		new Timetimer;
	}

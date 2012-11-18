// # Dragon
(function ($) {
	'use strict';
	// ## Event
	$.event.props.push("dataTransfer");
	// Extend jQuery Event to add a stop convenience function
	$.Event.prototype.stop = function () {
		this.stopPropagation();
		this.preventDefault();
	};
	// ## Plugin
	// Define the dragon plugin
	$.fn.dragon = function (options) {
		// Demark this as a jQuery object
		var $this = this,
			// Define offset variables
			offsetX, offsetY;
		// Create defaults to be overriden by user options
		var settings = $.extend({
			'target': 'body',
			'setData': 'Text',
			'effectAllowed': 'copyMove',
			start: function (e, $el) {
				return this;
			},
			drag: function (e, $el) {
				return this;
			},
			enter: function (e, $el) {
				return this;
			},
			over: function (e, $el) {
				return this;
			},
			leave: function (e, $el) {
				return this;
			},
			drop: function (e, $el) {
				return this;
			},
			end: function (e, $el) {
				return this;
			}
		}, options);
		// ## API
		// Define API after optional overrides
		$this.start = settings.start;
		$this.drag = settings.drag;
		$this.enter = settings.enter;
		$this.over = settings.over;
		$this.leave = settings.leave;
		$this.drop = settings.drop;
		$this.end = settings.end;
		// ## Drop Target
		// Add event handlers to the drop target
        //    scope the callbacks to not be on the drop target
		$(settings.target)
			.on('dragenter', function (e) {
				e.stop();
				$this.enter.call($this, e, $this);
			})
			.on('dragover', function (e) {
				e.stop();
				$this.over.call($this, e, $this);
			})
			.on('dragleave', function (e) {
				e.stopPropagation();
				$this.leave.call($this, e, $this);
			})
			.on('drop', function (e) {
				e.stop();
				$this.offset({
					top: e.originalEvent.pageY - $this.offsetY,
					left: e.originalEvent.pageX - $this.offsetX
				});
				$this.drop.call($this, e, $this);
			});
		// ## Drag element
		// Add event handlers to this
        //    Call the callbacks
		$this
			// Save intitial mouse offset on this
			//    Enable browser dragging
			.mousedown(function (e) {
				e.stopPropagation();
				this.draggable = true;
				$this.offsetX = e.offsetX;
				$this.offsetY = e.offsetY;
			})
			// Set the dataTransfer options
			.on('dragstart', function (e) {
				e.stopPropagation();
				e.dataTransfer.effectAllowed = settings.effectAllowed;
				e.dataTransfer.setData(settings.setData, this.id);

				$this.start.call($this, e, $this);
			})
			.on('drag', function (e) {
				$this.drag.call($this, e, $this);
			})
			// Disable browser dragging at the end of the drag operation
			.on('dragend', function (e) {
				e.stopPropagation();
				this.draggable = false;
				$this.end.call($this, e, $this);
			});

		return $this;
	};

}(jQuery));

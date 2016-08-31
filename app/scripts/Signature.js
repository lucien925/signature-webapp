$(function() (
	'use strict'

	var CONFIG = {

		textTmpl: '<div class="">' + 
						'<span class=""></span>' + 
						'<span class=""></span>' +
				  '</div>',
		imageTmpl: '<div class="">' +
						'<div class="">' + 
							'<img src="" alt="">' +
						'</div>' +
						'<p></p>' +
					'</div>'
	}

	function Signature(opts) {
		this.$container = $(opts.container)
		this.data = opts.data
		this.focusEle = null

	}

	Signature.prototype.init = function() {
		var $labels = this.$container.find('[data-role="label"]')
			width = $container.width(),
			height = $container.height()
		this.globalCenter = [width / 2, height / 2]
		if($labels.length > 0) {
			this.initStaffs($labels)
		}
	}

	Signature.prototype.initStaffs = function($ele) {
		var self = this
		$ele.each(function() {
			var $this = $(this),
				position = $this.position(),
				width = $this.width(),
				height = $this.height(),
				uuid = helper.generateUUID(),
				coordinate

			coordinate = self._getCoordinate(width, height, position.left, position.top)
			self._addData(uuid, coordinate)
			self._bindEvent($this)
		})
	}

	Signature.prototype._getCoordinate = function(w, h, l, t) {

		return [
			[l, t],
			[l + w, t],
			[l, t + h],
			[l + w, t + h]
		]
	}

	Signature.prototype._addData = function(id, coordinate) {
		this.data[uid] = coordinate
	}

	Signature.prototype._bindEvent = function($ele) {
		var self = this
		// click
		$ele.on('click', function() {
			self.focusEle = $(this)
		})
		// draggable
		$ele.draggable({
			drag: function(e, ui) {

			},
			stop: function() {

			}
		})
		// remove

		// contextmenu
		$ele.on('contextmenu', function(e) {
			e.preventDefault()
			self._showContextMenu(e)
		})
		// container dragover/drop
		self.$container.on({
			dragover: function(e) {
				if(self.$container.hasClass('over')) {
					return
				}
				self.$container.addClass('over')
			},
			dragleave: function(e) {
				self.$container.removeClass('over')
			},
			drop: function(e) {
				self.$container.removeClass('over')
				// @todo: 处理属性拖拽带绘制面板的逻辑

			}
		})
		// container blur		
	}


))